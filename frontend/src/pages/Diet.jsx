import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateDietPlan, getDietHistory } from "../services/dietService.js";

const Diet = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const data = await getDietHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load diet history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await generateDietPlan();
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate a plan");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold">Diet Plan</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
        >
          Back to dashboard
        </button>
      </nav>

      <main className="px-4 sm:px-6 py-8 max-w-lg mx-auto space-y-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Get a diet suggestion based on your body type, height, weight, and goal from your profile.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full rounded-lg bg-primary-600 text-white py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate my diet plan"}
          </button>
          {error && (
            <p className="text-sm text-red-500 mt-3">
              {error}{" "}
              {error.toLowerCase().includes("profile") && (
                <button onClick={() => navigate("/profile")} className="underline">
                  Go to profile
                </button>
              )}
            </p>
          )}
        </div>

        {history.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Your plans
            </h3>
            {history.map((plan) => (
              <div
                key={plan._id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6"
              >
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(plan.createdAt).toLocaleString()}
                </p>
                <pre className="text-sm whitespace-pre-wrap font-sans">{plan.suggestion}</pre>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Diet;