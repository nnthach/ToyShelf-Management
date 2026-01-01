import api from "../config/axios";

export const getAllStores = async <T>(params: T) => {
  const res = await api.get("/stores", { params });
  return res.data;
};
