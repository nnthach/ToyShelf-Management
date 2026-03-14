import api from "../config/axios";

export const getAllInventoryAPI = async <T>(params: T) => {
  const res = await api.get("/Inventory", { params });
  return res.data;
};

export const getInventoryDetailAPI = async (id: string) => {
  const res = await api.get(`/Inventory/${id}`);
  return res.data;
};

export const refillInventoryAPI = async <T>(data: T) => {
  const res = await api.post("/Inventory/refill", data);
  return res.data;
};

export const updateInventoryAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/Inventory/${id}`, data);
  return res.data;
};

export const deleteInventoryAPI = async (id: string) => {
  const res = await api.delete(`/Inventory/${id}/delete`);
  return res.data;
};
