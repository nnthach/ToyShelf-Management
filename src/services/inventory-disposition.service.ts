import api from "../config/axios";

export const getAllInventoryDispositionAPI = async <T>(params: T) => {
  const res = await api.get("/InventoryDisposition", { params });
  return res.data;
};

export const getInventoryDispositionDetailAPI = async (id: string) => {
  const res = await api.get(`/InventoryDisposition/${id}`);
  return res.data;
};

export const createInventoryDispositionAPI = async <T>(data: T) => {
  const res = await api.post("/InventoryDisposition", data);
  return res.data;
};

export const updateInventoryDispositionAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/InventoryDisposition/${id}`, data);
  return res.data;
};

export const deleteInventoryDispositionAPI = async (id: string) => {
  const res = await api.delete(`/InventoryDisposition/${id}`);
  return res.data;
};
