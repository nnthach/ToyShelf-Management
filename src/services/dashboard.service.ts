import api from "../config/axios";

export const getDashboardPartnerStatCard = async <T>(params: T, id: string) => {
  const res = await api.get(`/Dashboard/partner/${id}/stat-card`, { params });
  return res.data;
};

export const getDashboardStoreStatCard = async <T>(params: T, id?: string) => {
  const res = await api.get(`/Dashboard/stat-card`, { params });
  return res.data;
};

export const getDashboardWarehouseStatCard = async <T>(
  params?: T,
  id?: string,
) => {
  const res = await api.get(`/Dashboard/warehouse/${id}`, { params });
  return res.data;
};
