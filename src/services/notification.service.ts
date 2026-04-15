import api from "../config/axios";

export const getAllNotificationAPI = async <T>(params: T) => {
  const res = await api.get("/MonthlySettlement", { params });
  return res.data;
};
