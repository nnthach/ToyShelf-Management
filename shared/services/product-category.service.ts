import api from "../config/axios";

export const getAllProductCategory = async <T>(params: T) => {
  const res = await api.get("/ProductCategory", { params });
  return res.data;
};
