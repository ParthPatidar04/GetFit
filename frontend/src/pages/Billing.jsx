import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder, verifyPayment, getSubscriptionStatus } from "../services/paymentService.js";

const Billing = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
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
        name: "Fitness Tracker",
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
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold">Billing</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
        >
          Back to dashboard
        </button>
      </nav>

      <main className="px-4 sm:px-6 py-8 max-w-md mx-auto">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-medium mb-1">Premium plan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ₹199/month — unlimited AI diet plans and more.
          </p>

          <div className="mb-4">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {status === "active" ? "Active" : "Free plan"}
            </span>
          </div>

          {status !== "active" && (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 text-white py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Subscribe now"}
            </button>
          )}

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Billing;