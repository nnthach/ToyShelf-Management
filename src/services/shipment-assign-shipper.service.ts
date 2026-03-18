import api from "../config/axios";

export const getMyShipmentAssignAPI = async <T>(params: T) => {
  const res = await api.get("/ShipmentAssignment/my", { params });
  return res.data;
};

export const getShipmentAssignDetailByStoreOrderIdAPI = async (id: string) => {
  const res = await api.get(`/ShipmentAssignment/store-order/${id}`);
  return res.data;
};

export const createShipmentAssignAPI = async <T>(data: T) => {
  const res = await api.post("/ShipmentAssignment", data);
  return res.data;
};

export const approveShipmentAssignAPI = async (id: string) => {
  const res = await api.patch(`/ShipmentAssignment/${id}/approve`);
  return res.data;
};

export const rejectShipmentAssignAPI = async (id: string) => {
  const res = await api.patch(`/ShipmentAssignment/${id}/reject`);
  return res.data;
};
