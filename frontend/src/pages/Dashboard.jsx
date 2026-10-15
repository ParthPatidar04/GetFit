import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ActivityHeatmap from "../components/ActivityHeatmap.jsx";
import CalendarView from "../components/CalendarView.jsx";
import OverviewCharts from "../components/OverviewCharts.jsx";
import { logActivity, getHeatmapData, getOverview } from "../services/activityService.js";

const dayKey = (d) => d.toISOString().split("T")[0];

const Dashboard = () => {
  const { user } = useAuth();
  const [heatmapData, setHeatmapData] = useState({});
  const [overview, setOverview] = useState({});
  const [logging, setLogging] = useState(false);

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
      await fetchAll();
    } catch (err) {
      console.error("Failed to log activity", err);
    } finally {
      setLogging(false);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "there";
  const loggedToday = Boolean(heatmapData[dayKey(new Date())]);
  const activeDays = Object.keys(heatmapData).length;
  const weekCount = (overview.daily || []).reduce((sum, d) => sum + d.count, 0);

  const streak = (() => {
    let count = 0;
    const d = new Date();
    // if today isn't logged yet, the streak continues from yesterday
    if (!heatmapData[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (heatmapData[dayKey(d)]) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  const stats = [
    { label: "Streak", value: streak, unit: streak === 1 ? "day" : "days" },
    { label: "This week", value: weekCount, unit: weekCount === 1 ? "workout" : "workouts" },
    { label: "Active days", value: activeDays, unit: "past year" },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-accent text-accent-fg p-6 sm:p-8">
        <div className="absolute -right-10 -bottom-12 w-52 h-52 rounded-full bg-black/10" />
        <div className="absolute right-20 -top-10 w-28 h-28 rounded-full bg-black/5" />
        <div className="relative max-w-md">
          <p className="text-sm font-medium opacity-70">Hello {firstName}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mt-1">
            Your journey to a healthier, stronger you.
          </h1>
          <button
            onClick={handleLogActivity}
            disabled={logging}
            className="mt-5 inline-flex items-center rounded-full bg-black text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {logging
              ? "Logging..."
              : loggedToday
              ? "Log another workout"
              : "Log today's workout"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">{s.value}</p>
            <p className="text-xs text-muted">{s.unit}</p>
          </div>
        ))}
      </section>

      <section className="card p-4 sm:p-6">
        <h2 className="font-semibold mb-4">Consistency</h2>
        <ActivityHeatmap heatmapData={heatmapData} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Calendar</h2>
          <CalendarView heatmapData={heatmapData} />
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Overview</h2>
          <OverviewCharts overview={overview} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;