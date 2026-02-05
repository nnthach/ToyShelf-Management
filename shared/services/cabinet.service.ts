import api from "../config/axios";

export const getAllCabinAPI = async <T>(params: T) => {
  const res = await api.get("/cabin/all", { params });
  return res.data;
};

export const getCabinDetailAPI = async (id: string) => {
  const res = await api.get(`/cabin/${id}`);
  return res.data;
};

export const createCabinAPI = async <T>(data: T) => {
  const res = await api.post("/cabin", data);
  return res.data;
};

export const updateCabinAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/cabin/${id}`, data);
  return res.data;
};

export const deleteCabinAPI = async (id: string) => {
  const res = await api.delete(`/cabin/${id}`);
  return res.data;
};

// export const disableStoreAPI = async (id: string) => {
//   const res = await api.patch(`/cabin/${id}/disable`);
//   return res.data;
// };

// export const restoreStoreAPI = async (id: string) => {
//   const res = await api.patch(`/cabin/${id}/restore`);
//   return res.data;
// };
