import api from "../config/axios";
import { User } from "../types";

export const loginAPI = async <T>(data: T) => {
  const res = await api.post("/account/login", data);
  return res.data;
};

export const forgotPasswordRequestAPI = async (email: string) => {
  const res = await api.post("/ForgotPassword/request", null, {
    params: { email },
  });
  return res.data;
};

export const changePasswordRequestAPI = async <T>(data: T) => {
  const res = await api.post("/account/set-password", data);
  return res.data;
};

export const forgotPasswordResetAPI = async <T>(data: T) => {
  const res = await api.post("/ForgotPassword/reset", data);
  return res.data;
};

export const getMyProfileAPI = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const updateMyProfileAPI = async <T>(data: T) => {
  const res = await api.put("/user", data);
  return res.data;
};

export const getAllUserAPI = async <T>(params: T) => {
  const res = await api.get("/user", { params });
  return res.data;
};

export const getUserDetailAPI = async (id: string) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};
