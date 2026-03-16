import api from "../config/axios";

export const getAllRefillAPI = async <T>(params: T) => {
  const res = await api.get("/StoreOrder", { params });
  return res.data;
};

export const getRefillDetailAPI = async (id: string) => {
  const res = await api.get(`/StoreOrder/${id}`);
  return res.data;
};

export const createRefillAPI = async <T>(data: T) => {
  const res = await api.post("/StoreOrder", data);
  return res.data;
};

export const approveRefillRequestAPI = async (id: string) => {
  const res = await api.patch(`/StoreOrder/${id}/approve`);
  return res.data;
};

export const rejectRefillRequestAPI = async (id: string) => {
  const res = await api.patch(`/StoreOrder/${id}/reject`);
  return res.data;
};
