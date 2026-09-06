import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ActivityHeatmap from "../components/ActivityHeatmap.jsx";
import CalendarView from "../components/CalendarView.jsx";
import OverviewCharts from "../components/OverviewCharts.jsx";
import { logActivity, getHeatmapData, getOverview } from "../services/activityService.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [heatmapData, setHeatmapData] = useState({});
  const [overview, setOverview] = useState({});
  const [logging, setLogging] = useState(false);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const fetchAll = async () => {
    try {
      const [heatmap, ov] = await Promise.all([getHeatmapData(), getOverview()]);
      setHeatmapData(heatmap);
      setOverview(ov);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogActivity = async () => {
    setLogging(true);
    try {
      await logActivity("workout", 1);
      await fetchAll(); // refresh everything after logging
    } catch (err) {
      console.error("Failed to log activity", err);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold">GetFit - Your Fitness Tracker</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/diet"
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
          >
            Diet
          </Link>
          <Link
            to="/billing"
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
          >
            Billing
          </Link>
          <Link
            to="/profile"
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
          >
            Profile
          </Link>
          <button
            onClick={toggleTheme}
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={logout}
            className="text-sm rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="px-4 sm:px-6 py-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-1">Hey {user?.name || "there"} 👋</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Here's your consistency so far.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Activity heatmap
            </h3>
            <button
              onClick={handleLogActivity}
              disabled={logging}
              className="text-sm rounded-lg bg-primary-600 text-white px-3 py-1.5 hover:bg-primary-700 disabled:opacity-60"
            >
              {logging ? "Logging..." : "Log today's activity"}
            </button>
          </div>
          <ActivityHeatmap heatmapData={heatmapData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Calendar
            </h3>
            <CalendarView heatmapData={heatmapData} />
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Overview
            </h3>
            <OverviewCharts overview={overview} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;