import api from "../config/axios";

export const getAllShipmentAPI = async <T>(params: T) => {
  const res = await api.get("/Shipment", { params });
  return res.data;
};

export const getShipmentDetailByAssignmentIdAPI = async (id: string) => {
  const res = await api.get(`/Shipment/assignment/${id}`);
  return res.data;
};

export const getShipmentDetailByIdAPI = async (id: string) => {
  const res = await api.get(`/Shipment/${id}`);
  return res.data;
};

export const createShipmentAPI = async <T>(data: T) => {
  const res = await api.post("/Shipment", data);
  return res.data;
};

export const pickupShipmentAPI = async <T>(id: string, data: T) => {
  const res = await api.patch(`/Shipment/${id}/pickup`, data);
  return res.data;
};

export const deliveryShipmentAPI = async <T>(id: string, data: T) => {
  const res = await api.patch(`/Shipment/${id}/delivery`, data);
  return res.data;
};

export const receiveShipmentAPI = async <T>(id: string, data: T) => {
  const res = await api.patch(`/Shipment/${id}/receive`, data);
  return res.data;
};

export const checkShelfItemsShipmentAPI = async (id: string) => {
  const res = await api.get(`/Shipment/${id}/shelf-items`);
  return res.data;
};
