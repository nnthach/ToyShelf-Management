import api from "../config/axios";

/*Shelf type */
export const getAllShelfTypeAPI = async <T>(params: T) => {
  const res = await api.get("/ShelfType", { params });
  return res.data;
};

export const getShelfTypeDetailAPI = async (id: string) => {
  const res = await api.get(`/ShelfType/${id}`);
  return res.data;
};

export const createShelfTypeAPI = async <T>(data: T) => {
  const res = await api.post("/ShelfType", data);
  return res.data;
};

export const updateShelfTypeAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/ShelfType/${id}`, data);
  return res.data;
};

export const deleteShelfTypeAPI = async (id: string) => {
  const res = await api.delete(`/ShelfType/${id}/delete`);
  return res.data;
};
export const disableShelfTypeAPI = async (id: string) => {
  const res = await api.patch(`/ShelfType/${id}/disable`);
  return res.data;
};
export const restoreShelfTypeAPI = async (id: string) => {
  const res = await api.patch(`/ShelfType/${id}/restore`);
  return res.data;
};

/*Shelf */
export const createShelfLocationAPI = async <T>(data: T) => {
  const res = await api.post("/Shelf", data);
  return res.data;
};

export const getAllShelfAPI = async <T>(params: T) => {
  const res = await api.get("/Shelf", { params });
  return res.data;
};

export const getTotalShelfCountAPI = async <T>(params: T) => {
  const res = await api.get("/Shelf/count", { params });
  return res.data;
};
