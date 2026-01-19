import api from "../config/axios";
import { User } from "../types";

export const loginAPI = async <T>(data: T) => {
  const res = await api.post("/account/login", data);
  return res.data;
};

export const getMyProfileAPI = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const getAllUsers = async <T>(params: T) => {
  const res = await api.get("/user/active", { params });
  return res.data;
};
