import api from "../config/axios";

export const getAllProductCategoryAPI = async <T>(params: T) => {
  const res = await api.get("/ProductCategory", { params });
  return res.data;
};

export const getProductCategoryDetailAPI = async (id: string) => {
  const res = await api.get(`/ProductCategory/${id}`);
  return res.data;
};

export const createProductCategoryAPI = async <T>(data: T) => {
  const res = await api.post("/ProductCategory", data);
  return res.data;
};

export const updateProductCategoryAPI = async <T>(id: string, data: T) => {
  const res = await api.put(`/ProductCategory/${id}`, data);
  return res.data;
};

export const deleteProductCategoryAPI = async (id: string) => {
  const res = await api.delete(`/ProductCategory/${id}`);
  return res.data;
};

export const disableProductCategoryAPI = async (id: string) => {
  const res = await api.patch(`/ProductCategory/${id}/disable`);
  return res.data;
};

export const restoreProductCategoryAPI = async (id: string) => {
  const res = await api.patch(`/ProductCategory/${id}/restore`);
  return res.data;
};
