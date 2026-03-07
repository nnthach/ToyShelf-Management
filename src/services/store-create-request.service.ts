import api from "../config/axios";

export const getAllStoreCreationRequestAPI = async <T>(params: T) => {
  const res = await api.get("/StoreCreationRequest", { params });
  return res.data;
};

export const getStoreCreationRequestDetailAPI = async (id: string) => {
  const res = await api.get(`/StoreCreationRequest/${id}`);
  return res.data;
};

export const createStoreCreationRequestAPI = async <T>(data: T) => {
  const res = await api.post("/StoreCreationRequest", data);
  return res.data;
};

export const updateStoreCreationRequestAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/StoreCreationRequest/${id}`, data);
  return res.data;
};

export const deleteStoreCreationRequestAPI = async (id: string) => {
  const res = await api.delete(`/StoreCreationRequest/${id}`);
  return res.data;
};

export const reviewStoreCreationRequestAPI = async <T>(data: T, id: string) => {
  const res = await api.post(`/StoreCreationRequest/${id}/review`, data);
  return res.data;
};
