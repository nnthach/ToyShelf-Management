import api from "../config/axios";

export const getDashboardPartnerStatCard = async <T>(params: T, id: string) => {
  const res = await api.get(`/Dashboard/partner/${id}/stat-card`, { params });
  return res.data;
};

export const getDashboardAdminStatCard = async <T>(params: T) => {
  const res = await api.get(`/Dashboard/admin/stat-card`, { params });
  return res.data;
};

export const getDashboardStoreStatCard = async <T>(params: T, id?: string) => {
  const res = await api.get(`/Dashboard/stat-card/store/${id}`, { params });
  return res.data;
};

export const getDashboardWarehouseStatCard = async <T>(
  params?: T,
  id?: string,
) => {
  const res = await api.get(`/Dashboard/warehouse/${id}`, { params });
  return res.data;
};

export const getDashboardStoreRevenueChart = async <T>(
  params: T,
  id?: string,
) => {
  const res = await api.get(`/Dashboard/store/${id}/revenue-chart`, { params });
  return res.data;
};

export const getDashboardPartnerChart = async <T>(params: T, id?: string) => {
  const res = await api.get(`/Dashboard/partner/${id}/chart`, { params });
  return res.data;
};

export const getDashboardAdminRevenueChart = async <T>(params: T) => {
  const res = await api.get(`/Dashboard/admin/revenue-chart`, { params });
  return res.data;
};

export const getDashboardTopSellingAPI = async <T>(params: T) => {
  const res = await api.get(`/Dashboard/top-selling`, { params });
  return res.data;
};

export const getDashboardTopStoreAPI = async <T>(params: T) => {
  const res = await api.get(`/Dashboard/top-stores`, { params });
  return res.data;
};

export const getDashboardTopPartnerAPI = async <T>(params: T) => {
  const res = await api.get(`/Dashboard/top-partners`, { params });
  return res.data;
};
