import api from "../config/axios";

export const getAllProducts = async <T>(params: T) => {
  const res = await api.get("/products", { params });
  return res.data;
};
