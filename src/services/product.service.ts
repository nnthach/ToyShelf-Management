import api from "../config/axios";

export const getAllProductAPI = async <T>(params: T) => {
  const res = await api.get("/product/paginated", { params });
  return res.data;
};

export const getProductDetailAPI = async (id: string) => {
  const res = await api.get(`/product/${id}`);
  return res.data;
};

export const createProductAPI = async <T>(data: T) => {
  const res = await api.post("/product", data);
  return res.data;
};

export const updateProductAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/product/${id}`, data);
  return res.data;
};

export const deleteProductAPI = async (id: string) => {
  const res = await api.delete(`/product/${id}/delete`);
  return res.data;
};

export const disableProductAPI = async (id: string) => {
  const res = await api.patch(`/product/${id}/disable`);
  return res.data;
};

export const restoreProductAPI = async (id: string) => {
  const res = await api.patch(`/product/${id}/restore`);
  return res.data;
};

// product color many to many

export const getAllProductColorColorAPI = async <T>(params: T) => {
  const res = await api.get("/ProductColor", { params });
  return res.data;
};

export const disableProductColorColorAPI = async (id: string) => {
  const res = await api.patch(`/ProductColor/${id}/disable`);
  return res.data;
};

export const restoreProductColorColorAPI = async (id: string) => {
  const res = await api.patch(`/ProductColor/${id}/restore`);
  return res.data;
};

export const deleteProductColorColorAPI = async (id: string) => {
  const res = await api.delete(`/ProductColor/${id}/delete`);
  return res.data;
};
