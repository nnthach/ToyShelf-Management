import api from "../config/axios";

export const getAllStoreAPI = async <T>(params: T) => {
  const res = await api.get("/store", { params });
  return res.data;
};

export const getAllPartnerStoreAPI = async <T>(params: T) => {
  const res = await api.get("/store", { params });
  return res.data;
};

export const getStoreDetailAPI = async (id: string) => {
  const res = await api.get(`/store/${id}`);
  return res.data;
};

export const createStoreAPI = async <T>(data: T) => {
  const res = await api.post("/store", data);
  return res.data;
};

export const updateStoreAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/store/${id}`, data);
  return res.data;
};

export const deleteStoreAPI = async (id: string) => {
  const res = await api.delete(`/store/${id}`);
  return res.data;
};

export const disableStoreAPI = async (id: string) => {
  const res = await api.patch(`/store/${id}/disable`);
  return res.data;
};

export const restoreStoreAPI = async (id: string) => {
  const res = await api.patch(`/store/${id}/restore`);
  return res.data;
};
