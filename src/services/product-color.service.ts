import api from "../config/axios";

export const getAllProductColorAPI = async <T>(params: T) => {
  const res = await api.get("/color", { params });
  return res.data;
};

export const getProductColorDetailAPI = async (id: string) => {
  const res = await api.get(`/color/${id}`);
  return res.data;
};

export const createProductColorAPI = async <T>(data: T) => {
  const res = await api.post("/color", data);
  return res.data;
};

export const updateProductColorAPI = async <T>(id: string, data: T) => {
  const res = await api.put(`/color/${id}`, data);
  return res.data;
};

export const deleteProductColorDetailAPI = async (id: string) => {
  const res = await api.delete(`/color/${id}/delete`);
  return res.data;
};
