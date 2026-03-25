import api from "../config/axios";

export const getAllInventoryAPI = async <T>(params: T) => {
  const res = await api.get("/Inventory", { params });
  return res.data;
};

export const getInventoryDetailAPI = async (id: string) => {
  const res = await api.get(`/Inventory/${id}`);
  return res.data;
};

export const refillInventoryAPI = async <T>(data: T) => {
  const res = await api.post("/Inventory/refill", data);
  return res.data;
};

export const getInventoryOfWarehouseByIdAPI = async (id: string) => {
  const res = await api.get(`/Inventory/warehouse/${id}/inventory`);
  return res.data;
};

export const getInventoryByLocationIdAPI = async (id: string) => {
  const res = await api.get(`/Inventory/location/${id}/inventory-overview`);
  return res.data;
};

export const getInventoryGlobalAPI = async () => {
  const res = await api.get(`/Inventory/global`);
  return res.data;
};
