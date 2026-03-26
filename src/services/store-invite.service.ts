import api from "../config/axios";

export const inviteToStoreAPI = async <T>(data: T) => {
  const res = await api.post("/StoreInvitation/invite", data);
  return res.data;
};

export const getStoreInvitesAPI = async <T>(params: T) => {
  const res = await api.get("/StoreInvitation", { params });
  return res.data;
};

export const getMyStoreAPI = async () => {
  const res = await api.get("/StoreInvitation/my-stores");
  return res.data;
};

export const getMyStoreInviteAPI = async () => {
  const res = await api.get("/StoreInvitation/my-invitations");
  return res.data;
};

export const acceptStoreInviteAPI = async (invitationId: string) => {
  const res = await api.post(`/StoreInvitation/${invitationId}/accept`);
  return res.data;
};

export const rejectStoreInviteAPI = async (invitationId: string) => {
  const res = await api.post(`/StoreInvitation/${invitationId}/reject`);
  return res.data;
};
