import api from "../config/axios";

export const getAllMonthlySettlementAPI = async <T>(params: T) => {
  const res = await api.get("/MonthlySettlement", { params });
  return res.data;
};

export const getMonthlySettlementDetailAPI = async (id: string) => {
  const res = await api.get(`/MonthlySettlement/${id}`);
  return res.data;
};

export const createMonthlySettlementGenerateAPI = async (
  year: number,
  month: number,
) => {
  const res = await api.post(`/MonthlySettlement/generate/${year}/${month}`);
  return res.data;
};

export const updateMonthlySettlementBankedAPI = async (id: string) => {
  const res = await api.patch(`/MonthlySettlement/${id}/pay`);
  return res.data;
};

export const updateMonthlySettlementAdditionalFeeAPI = async <T>(
  data: T,
  id: string,
) => {
  const res = await api.put(`/MonthlySettlement/${id}/deduction`, data);
  return res.data;
};
