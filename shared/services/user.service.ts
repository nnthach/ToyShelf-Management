import api from "../config/axios";
import { User } from "../types";

export const loginAPI = async <T>(data: T) => {
  const res = await api.post("/account/login", data);
  return res.data;
};

export const getAllUsers = async <T>(params: T): Promise<User[]> => {
  const res = await api.get("/user/active", { params });
  return res.data.data;
};
