import api from "../config/axios";

export const getAllRefillShelfAPI = async <T>(params: T) => {
  const res = await api.get("/ShelfOrder", { params });
  return res.data;
};

export const getRefillShelfDetailAPI = async (id: string) => {
  const res = await api.get(`/ShelfOrder/${id}`);
  return res.data;
};

export const createRefillShelfAPI = async <T>(data: T) => {
  const res = await api.post("/ShelfOrder", data);
  return res.data;
};

export const approveRefillShelfRequestAPI = async (id: string) => {
  const res = await api.patch(`/ShelfOrder/${id}/approve`);
  return res.data;
};

export const rejectRefillShelfRequestAPI = async (
  id: string,
  data?: string,
) => {
  const res = await api.patch(`/ShelfOrder/${id}/reject`, data);
  return res.data;
};

export const getShelfOrderAvailableWarehouseAPI = async (id: string) => {
  const res = await api.get(`/ShelfOrder/${id}/available-warehouses`);
  return res.data;
};
