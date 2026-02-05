import api from "../config/axios";

export const inviteToStoreAPI = async <T>(data: T) => {
  const res = await api.post("/StoreInvitation/invite", data);
  return res.data;
};
