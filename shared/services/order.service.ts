import api from "../config/axios";

export const getAllOrders = async <T>(params: T) => {
  const res = await api.get("/orders", { params });
  return res.data;
};
