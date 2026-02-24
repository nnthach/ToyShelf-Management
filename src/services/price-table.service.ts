import api from "../config/axios";

export const getAllPriceTableAPI = async <T>(params: T) => {
  const res = await api.get("/PriceTable", { params });
  return res.data;
};

export const getPriceTableDetailAPI = async (id: string) => {
  const res = await api.get(`/PriceTable/${id}`);
  return res.data;
};

export const createPriceTableAPI = async <T>(data: T) => {
  const res = await api.post("/PriceTable", data);
  return res.data;
};

export const updatePriceTableAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/PriceTable/${id}`, data);
  return res.data;
};

export const deletePriceTableAPI = async (id: string) => {
  const res = await api.delete(`/PriceTable/${id}/delete`);
  return res.data;
};
