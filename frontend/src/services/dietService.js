import api from "./api.js";

export const generateDietPlan = async () => {
  const { data } = await api.post("/diet/generate");
  return data;
};

export const getDietHistory = async () => {
  const { data } = await api.get("/diet/history");
  return data;
};

export const sendDietChat = async (message, history) => {
  const { data } = await api.post("/diet/chat", { message, history });
  return data;
};