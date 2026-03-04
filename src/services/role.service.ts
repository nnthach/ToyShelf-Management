import api from "../config/axios";

export const getAllRoleAPI = async <T>(params: T) => {
  const res = await api.get("/Role", { params });
  return res.data;
};

export const getRoleDetailAPI = async (id: string) => {
  const res = await api.get(`/Role/${id}`);
  return res.data;
};

export const createRoleAPI = async <T>(data: T) => {
  const res = await api.post("/Role", data);
  return res.data;
};

export const updateRoleAPI = async <T>(data: T, id: string) => {
  const res = await api.put(`/Role/${id}`, data);
  return res.data;
};

export const deleteRoleAPI = async (id: string) => {
  const res = await api.delete(`/Role/${id}/delete`);
  return res.data;
};
