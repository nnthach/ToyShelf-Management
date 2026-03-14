import api from "../config/axios";

export const getAllInventoryLocationAPI = async <T>(params: T) => {
  const res = await api.get("/InventoryLocation", { params });
  return res.data;
};

export const getInventoryLocationDetailAPI = async (id: string) => {
  const res = await api.get(`/InventoryLocation/${id}`);
  return res.data;
};
