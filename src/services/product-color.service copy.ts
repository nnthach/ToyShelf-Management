import api from "../config/axios";

export const getAllProductColor = async <T>(params: T) => {
  const res = await api.get("/ProductColor", { params });
  return res.data;
};
