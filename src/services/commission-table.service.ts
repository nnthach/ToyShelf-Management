import api from "../config/axios";

export const getAllCommissionTableAPI = async <T>(params: T) => {
  const res = await api.get("/CommissionTable", { params });
  return res.data;
};

export const getCommissionTableDetailAPI = async (id: string) => {
  const res = await api.get(`/CommissionTable/${id}`);
  return res.data;
};

export const createCommissionTableAPI = async <T>(data: T) => {
  const res = await api.post("/CommissionTable", data);
  return res.data;
};

export const updateCommissionTableAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/CommissionTable/${id}`, data);
  return res.data;
};

export const deleteCommissionTableAPI = async (id: string) => {
  const res = await api.delete(`/CommissionTable/${id}/delete`);
  return res.data;
};
