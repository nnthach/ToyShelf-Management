import api from "../config/axios";

export const getAllShelfTypeAPI = async <T>(params: T) => {
  const res = await api.get("/ShefType", { params });
  return res.data;
};

export const getShelfTypeDetailAPI = async (id: string) => {
  const res = await api.get(`/ShefType/${id}`);
  return res.data;
};

export const createShelfTypeAPI = async <T>(data: T) => {
  const res = await api.post("/ShefType", data);
  return res.data;
};

export const updateShelfTypeAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/ShefType/${id}`, data);
  return res.data;
};

export const deleteShelfTypeAPI = async (id: string) => {
  const res = await api.delete(`/ShefType/${id}/delete`);
  return res.data;
};
export const disableShelfTypeAPI = async (id: string) => {
  const res = await api.patch(`/ShefType/${id}/disable`);
  return res.data;
};
export const restoreShelfTypeAPI = async (id: string) => {
  const res = await api.patch(`/ShefType/${id}/restore`);
  return res.data;
};
