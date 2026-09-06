import api from "./api.js";

export const createOrder = async () => {
  const { data } = await api.post("/payment/create-order");
  return data;
};

export const verifyPayment = async (paymentData) => {
  const { data } = await api.post("/payment/verify", paymentData);
  return data;
};

export const getSubscriptionStatus = async () => {
  const { data } = await api.get("/payment/status");
  return data;
};