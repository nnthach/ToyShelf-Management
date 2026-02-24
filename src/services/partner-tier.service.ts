import api from "../config/axios";

export const getAllPartnerTierAPI = async <T>(params: T) => {
  const res = await api.get("/PartnerTier", { params });
  return res.data;
};

export const getPartnerTierDetailAPI = async (id: string) => {
  const res = await api.get(`/PartnerTier/${id}`);
  return res.data;
};

export const createPartnerTierAPI = async <T>(data: T) => {
  const res = await api.post("/PartnerTier", data);
  return res.data;
};

export const updatePartnerTierAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/PartnerTier/${id}`, data);
  return res.data;
};

export const deletePartnerTierAPI = async (id: string) => {
  const res = await api.delete(`/PartnerTier/${id}`);
  return res.data;
};
