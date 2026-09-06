import api from "./api.js";

export const logActivity = async (type = "workout", value = 1) => {
  const { data } = await api.post("/activities", { type, value });
  return data;
};

export const getHeatmapData = async () => {
  const { data } = await api.get("/activities/heatmap");
  return data;
};

export const getActivities = async (from, to) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get("/activities", { params });
  return data;
};

export const getOverview = async () => {
  const { data } = await api.get("/activities/overview");
  return data;
};