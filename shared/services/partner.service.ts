import api from "../config/axios";

export const getAllPartnerAPI = async <T>(params: T) => {
  const res = await api.get("/partner", { params });
  return res.data;
};

export const getPartnerDetailAPI = async (id: string) => {
  const res = await api.get(`/partner/${id}`);
  return res.data;
};

export const createPartnerAPI = async <T>(data: T) => {
  const res = await api.post("/partner", data);
  return res.data;
};

export const updatePartnerAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/partner/${id}`, data);
  return res.data;
};

export const deletePartnerAPI = async (id: string) => {
  const res = await api.delete(`/partner/${id}`);
  return res.data;
};
