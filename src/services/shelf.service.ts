import api from "../config/axios";

export const getAllShelfAPI = async <T>(params: T) => {
  const res = await api.get("/shelf", { params });
  return res.data;
};

export const getShelfDetailAPI = async (id: string) => {
  const res = await api.get(`/shelf/${id}`);
  return res.data;
};

export const createShelfAPI = async <T>(data: T) => {
  const res = await api.post("/shelf", data);
  return res.data;
};

export const updateShelfAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/shelf/${id}`, data);
  return res.data;
};

export const deleteShelfAPI = async (id: string) => {
  const res = await api.delete(`/shelf/${id}`);
  return res.data;
};
