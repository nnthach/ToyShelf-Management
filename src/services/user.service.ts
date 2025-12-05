import api from "config/axios";

export const getAllUsers = async <T>(params: T) => {
  const res = await api.get("/users", { params });
  return res.data;
};
