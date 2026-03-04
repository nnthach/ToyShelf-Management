import api from "../config/axios";

export const createAllRoleAccountAPI = async <T>(data: T) => {
  const res = await api.post("/account/activate/internal", data);
  return res.data;
};

export const createPartnerStaffAccountAPI = async <T>(data: T) => {
  const res = await api.post("/account/activate/internal/partner", data);
  return res.data;
};

export const activeAccountRequestAPI = async (email: string) => {
  const res = await api.post("/account/activate/request", null, {
    params: { email },
  });
  return res.data;
};

export const activeAccountConfirmAPI = async <T>(data: T) => {
  const res = await api.post("/account/activate/confirm", data);
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
