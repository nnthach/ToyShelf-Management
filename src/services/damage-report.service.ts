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

export const createDamageAssignWarehouseAPI = async <T>(
  id: string,
  params: T,
) => {
  const res = await api.post(`/DamageReport/${id}/create-assignment`, null, {
    params,
  });
  return res.data;
};

export const adminApproveDamageReportRequestAPI = async (id: string) => {
  const res = await api.patch(`/DamageReport/${id}/admin-approve`);
  return res.data;
};

export const partnerApproveDamageReportRequestAPI = async <T>(id: string) => {
  const res = await api.patch(`/DamageReport/${id}/partner-approve`);
  return res.data;
};

export const rejectDamageReportRequestAPI = async (
  id: string,
  reason?: string,
) => {
  const res = await api.patch(`/DamageReport/${id}/reject`, reason);
  return res.data;
};
