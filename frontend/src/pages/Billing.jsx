import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder, verifyPayment, getSubscriptionStatus } from "../services/paymentService.js";

const PERKS = ["AI diet plans", "Diet assistant chat", "Progress analytics"];

const Billing = () => {
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState(user?.subscriptionStatus || "free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const data = await getSubscriptionStatus();
      setStatus(data.subscriptionStatus);
    } catch (err) {
      console.error("Failed to fetch status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const { orderId, amount, currency, keyId } = await createOrder();

      const options = {
        key: keyId,
        amount,
        currency,
        name: "GetFit",
        description: "Monthly subscription",
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const updated = { ...user, subscriptionStatus: "active" };
            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
            setStatus("active");
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#d9ff00" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment");
    } finally {
      setLoading(false);
    }
  };

  const isActive = status === "active";

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Billing</h1>
        <p className="text-sm text-muted">Manage your subscription.</p>
      </div>

      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Premium plan</h2>
          <span
            className={`text-xs font-semibold rounded-full px-3 py-1 ${
              isActive ? "bg-accent text-accent-fg" : "bg-surface2 text-muted"
            }`}
          >
            {isActive ? "Active" : status === "expired" ? "Expired" : "Free plan"}
          </span>
        </div>

        <p className="text-4xl font-extrabold">
          ₹199<span className="text-base font-medium text-muted"> / month</span>
        </p>

        <ul className="mt-5 space-y-2">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm">
              <span className="grid place-items-center w-5 h-5 rounded-full bg-accent text-accent-fg">
                <Check size={12} strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>

        {!isActive && (
          <button onClick={handleSubscribe} disabled={loading} className="btn-accent w-full mt-6">
            {loading ? "Loading..." : "Subscribe now"}
          </button>
        )}

        {error && <p className="text-sm text-brand mt-3">{error}</p>}
      </section>
    </div>
  );
};

export default Billing;