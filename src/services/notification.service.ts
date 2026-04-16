import api from "../config/axios";

export const getNotificationByUserIdAPI = async (id: string) => {
  const res = await api.get(`/Notification/user/${id}`);
  return res.data;
};

export const readNotificationAPI = async (notiId: string, userId: string) => {
  const res = await api.put(`/Notification/${notiId}/read/user/${userId}`);
  return res.data;
};
