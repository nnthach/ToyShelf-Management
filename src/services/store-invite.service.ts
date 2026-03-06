import api from "../config/axios";

export const inviteToStoreAPI = async <T>(data: T) => {
  const res = await api.post("/StoreInvitation/invite", data);
  return res.data;
};

export const getStoreInvitesAPI = async <T>(params: T) => {
  const res = await api.get("/StoreInvitation", { params });
  return res.data;
};
