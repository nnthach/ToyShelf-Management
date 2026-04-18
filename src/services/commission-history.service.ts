import api from "../config/axios";

export const getAllCommissionHistoryAPI = async <T>(params: T) => {
  const res = await api.get("/CommissionHistory/history", { params });
  return res.data;
};
