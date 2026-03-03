import api from "../config/axios";

export const getAllCityAPI = async <T>(params: T) => {
  const res = await api.get("/City", { params });
  return res.data;
};

export const getCityDetailAPI = async (id: string) => {
  const res = await api.get(`/City/${id}`);
  return res.data;
};

export const createCityAPI = async <T>(data: T) => {
  const res = await api.post("/City", data);
  return res.data;
};

export const updateCityAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/City/${id}`, data);
  return res.data;
};

export const deleteCityAPI = async (id: string) => {
  const res = await api.delete(`/City/${id}/delete`);
  return res.data;
};
