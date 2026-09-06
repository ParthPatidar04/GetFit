import Activity from "../models/Activity.js";

// @route POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const { date, type, value, note } = req.body;

    const activity = await Activity.create({
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      type: type || "workout",
      value: value || 1,
      note: note || "",
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/activities
// optional query params: from, to (ISO date strings)
export const getActivities = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { user: req.user._id };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const activities = await Activity.find(filter).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/activities/heatmap
// returns { "2026-09-01": 3, "2026-09-02": 1, ... } — date string -> entry count
export const getHeatmapData = async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: oneYearAgo },
    });

    const counts = {};
    activities.forEach((a) => {
      const key = a.date.toISOString().split("T")[0]; // YYYY-MM-DD
      counts[key] = (counts[key] || 0) + 1;
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, user: req.user._id });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    await activity.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/activities/overview
// returns activity counts bucketed by day (last 7), week (last 4), month (last 12), year
export const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: oneYearAgo },
    });

    // daily - last 7 days
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const count = activities.filter(
        (a) => a.date.toISOString().split("T")[0] === key
      ).length;
      daily.push({ label: key.slice(5), count }); // MM-DD
    }

    // weekly - last 4 weeks (7-day buckets)
    const weekly = [];
    for (let i = 3; i >= 0; i--) {
      const end = new Date();
      end.setDate(now.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      const count = activities.filter((a) => a.date >= start && a.date <= end).length;
      weekly.push({ label: `Week ${4 - i}`, count });
    }

    // monthly - last 12 months
    const monthly = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = activities.filter(
        (a) => a.date.getFullYear() === d.getFullYear() && a.date.getMonth() === d.getMonth()
      ).length;
      monthly.push({ label: d.toLocaleString("default", { month: "short" }), count });
    }

    // yearly - group by whichever years have data
    const yearlyMap = {};
    activities.forEach((a) => {
      const y = a.date.getFullYear();
      yearlyMap[y] = (yearlyMap[y] || 0) + 1;
    });
    const yearly = Object.entries(yearlyMap).map(([year, count]) => ({ label: year, count }));

    res.json({ daily, weekly, monthly, yearly });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};