import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { generateDietPlan, getDietHistory } from "../services/dietService.js";
import DietChat from "../components/DietChat.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Diet = () => {
  const [plans, setPlans] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("plan"); // mobile/tablet only

  const fetchPlans = async () => {
    try {
      const data = await getDietHistory();
      setPlans(data); // newest first
    } catch (err) {
      console.error("Failed to load diet history", err);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await generateDietPlan();
      await fetchPlans();
      setTab("plan");
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate a plan");
    } finally {
      setGenerating(false);
    }
  };

  const [latest, ...older] = plans;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Diet</h1>
          <p className="text-sm text-muted">
            Built from your body type, goal and food preference.
          </p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-accent">
          <Sparkles size={16} />
          {generating ? "Generating..." : latest ? "Generate new plan" : "Generate my plan"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-brand">
          {error}{" "}
          {error.toLowerCase().includes("profile") && (
            <Link to="/profile" className="underline font-medium">
              Go to profile
            </Link>
          )}
        </p>
      )}

      {/* tabs: only below lg, on desktop both columns show */}
      <div className="lg:hidden flex gap-1 p-1 rounded-full bg-surface2 w-fit">
        {[
          { key: "plan", label: "Diet plan" },
          { key: "assistant", label: "Assistant" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              tab === t.key ? "bg-accent text-accent-fg" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* plan column */}
        <div className={`space-y-4 ${tab === "plan" ? "" : "hidden lg:block"}`}>
          {!loaded ? (
            <div className="card p-6 text-sm text-muted">Loading...</div>
          ) : latest ? (
            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs rounded-full bg-accent text-accent-fg font-semibold px-3 py-1">
                  Latest plan
                </span>
                <span className="text-xs text-muted">{formatDate(latest.createdAt)}</span>
              </div>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {latest.suggestion}
              </pre>
            </div>
          ) : (
            <div className="card p-6 text-sm text-muted">
              No plan yet. Complete your profile (body type, height, weight, goal and diet
              preference), then tap "Generate my plan".
            </div>
          )}

          {older.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted">Previous plans</h2>
              {older.map((plan) => (
                <details key={plan._id} className="card px-5 py-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    {formatDate(plan.createdAt)}
                  </summary>
                  <pre className="mt-3 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {plan.suggestion}
                  </pre>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* chat column */}
        <div className={tab === "assistant" ? "" : "hidden lg:block"}>
          <DietChat />
        </div>
      </div>
    </div>
  );
};

export default Diet;