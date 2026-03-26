import api from "../config/axios";

export const getAllCommissionTableApplyAPI = async <T>(params: T) => {
  const res = await api.get("/CommissionTableApply", { params });
  return res.data;
};

export const getCommissionTableApplyDetailAPI = async (id: string) => {
  const res = await api.get(`/CommissionTableApply/${id}`);
  return res.data;
};

export const createCommissionTableApplyAPI = async <T>(data: T) => {
  const res = await api.post("/CommissionTableApply", data);
  return res.data;
};

export const updateCommissionTableApplyAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/CommissionTableApply/${id}`, data);
  return res.data;
};

export const deleteCommissionTableApplyAPI = async (id: string) => {
  const res = await api.delete(`/CommissionTableApply/${id}/delete`);
  return res.data;
};

export const disableCommissionTableApplyAPI = async (id: string) => {
  const res = await api.patch(`/CommissionTableApply/${id}/disable`);
  return res.data;
};

export const restoreCommissionTableApplyAPI = async (id: string) => {
  const res = await api.patch(`/CommissionTableApply/${id}/restore`);
  return res.data;
};
