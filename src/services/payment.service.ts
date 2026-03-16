import api from "../config/axios";

export const paymentCheckoutAPI = async <T>(data: T) => {
  const res = await api.post("/payment/checkout", data);
  return res.data;
};

export const getPaymentDetail = async (orderCode: number) => {
  const res = await api.get(`/payment/${orderCode}`);
  return res.data;
};

export const checkPaymentAPI = async <T>(params: T) => {
  const res = await api.get("/payment/check-payment", { params });
  return res.data;
};
