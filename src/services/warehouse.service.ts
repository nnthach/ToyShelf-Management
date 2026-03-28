import api from "../config/axios";

export const getAllWarehouseAPI = async <T>(params: T) => {
  const res = await api.get("/warehouse", { params });
  return res.data;
};

export const getWarehouseDetailAPI = async <T>(id: string, params: T) => {
  const res = await api.get(`/warehouse/${id}/detail`, { params });
  return res.data;
};

export const createWarehouseAPI = async <T>(data: T) => {
  const res = await api.post("/warehouse", data);
  return res.data;
};

export const updateWarehouseAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/warehouse/${id}`, data);
  return res.data;
};

export const deleteWarehouseAPI = async (id: string) => {
  const res = await api.delete(`/warehouse/${id}`);
  return res.data;
};

export const disableWarehouseAPI = async (id: string) => {
  const res = await api.patch(`/warehouse/${id}/disable`);
  return res.data;
};

export const restoreWarehouseAPI = async (id: string) => {
  const res = await api.patch(`/warehouse/${id}/restore`);
  return res.data;
};
