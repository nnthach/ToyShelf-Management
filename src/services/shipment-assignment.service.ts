import api from "../config/axios";

export const getAllShipmentAssignAPI = async <T>(params: T) => {
  const res = await api.get("/ShipmentAssignment", { params });
  return res.data;
};

export const getMyShipmentAssignAPI = async <T>(params: T) => {
  const res = await api.get("/ShipmentAssignment/my", { params });
  return res.data;
};

export const getShipmentAssignDetailByStoreOrderIdAPI = async (id: string) => {
  const res = await api.get(`/ShipmentAssignment/store-order/${id}`);
  return res.data;
};

export const getShipmentAssignDetailByIdAPI = async (id: string) => {
  const res = await api.get(`/ShipmentAssignment/${id}`);
  return res.data;
};

export const createShipmentAssignWarehouseAPI = async <T>(data: T) => {
  const res = await api.post("/ShipmentAssignment", data);
  return res.data;
};

export const assignShipperShipmentAssignAPI = async <T>(data: T) => {
  const res = await api.patch(`/ShipmentAssignment/assign-shipper`, data);
  return res.data;
};

export const acceptShipmentAssignAPI = async (id: string) => {
  const res = await api.patch(`/ShipmentAssignment/${id}/accept`);
  return res.data;
};

export const rejectShipmentAssignAPI = async (id: string) => {
  const res = await api.patch(`/ShipmentAssignment/${id}/reject`);
  return res.data;
};
