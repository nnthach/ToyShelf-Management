import api from "../config/axios";

export const getDashboardPartnerStatCard = async <T>(params: T, id: string) => {
  const res = await api.get(`/Dashboard/partner/${id}/stat-card`, { params });
  return res.data;
};
