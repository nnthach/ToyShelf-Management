import api from "../config/axios";

export const getAllDamageReportAPI = async <T>(params: T) => {
  const res = await api.get("/DamageReport", { params });
  return res.data;
};

export const getDamageReportDetailAPI = async (id: string) => {
  const res = await api.get(`/DamageReport/${id}`);
  return res.data;
};

export const createDamageReportAPI = async <T>(data: T) => {
  const res = await api.post("/DamageReport", data);
  return res.data;
};

export const approveDamageReportRequestAPI = async <T>(id: string, data: T) => {
  const res = await api.patch(`/DamageReport/${id}/approve`, data);
  return res.data;
};

export const rejectDamageReportRequestAPI = async (id: string) => {
  const res = await api.patch(`/DamageReport/${id}/reject`);
  return res.data;
};
