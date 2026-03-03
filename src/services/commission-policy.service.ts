import api from "../config/axios";

export const getAllCommissionPolicyAPI = async <T>(params: T) => {
  const res = await api.get("/CommissionPolicy", { params });
  return res.data;
};

export const getCommissionPolicyDetailAPI = async (id: string) => {
  const res = await api.get(`/CommissionPolicy/${id}`);
  return res.data;
};

export const createCommissionPolicyAPI = async <T>(data: T) => {
  const res = await api.post("/CommissionPolicy", data);
  return res.data;
};

export const updateCommissionPolicyAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/CommissionPolicy/${id}`, data);
  return res.data;
};

export const deleteCommissionPolicyAPI = async (id: string) => {
  const res = await api.delete(`/CommissionPolicy/${id}`);
  return res.data;
};
