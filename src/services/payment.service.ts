import api from "../config/axios";

export const paymentCheckoutAPI = async <T>(data: T) => {
  const res = await api.post("/payment/checkout", data);
  return res.data;
};
