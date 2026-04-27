import api from "../config/axios";

export const getAllOrdersAPI = async <T>(params: T) => {
  const res = await api.get("/order", { params });
  return res.data;
};

export const getOrderDetailAPI = async (orderCode: number) => {
  const res = await api.get(`/order/${orderCode}`);
  return res.data;
};

export const getOrderDetailPartnerAPI = async (orderCode: number) => {
  const res = await api.get(`/order/partner/${orderCode}`);
  return res.data;
};
