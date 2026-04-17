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

export const getShipmentForReceiveByIdAPI = async (id: string) => {
  const res = await api.get(`/Shipment/${id}/for-receiving`);
  return res.data;
};

export const getShipmentDetailByStoreOrderIdAPI = async (id: string) => {
  const res = await api.get(`/Shipment/store-order/${id}`);
  return res.data;
};

export const getShipmentDetailByShelfOrderIdAPI = async (id: string) => {
  const res = await api.get(`/Shipment/shelf-order/${id}`);
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

export const warehouseReceiveReturnShipmentAPI = async (id: string) => {
  const res = await api.patch(`/Shipment/${id}/warehouse-receive-return`);
  return res.data;
};

export const receiveShipmentAPI = async <T>(id: string, data: T) => {
  const res = await api.patch(`/Shipment/${id}/store-receive`, data);
  return res.data;
};

export const checkShelfItemsShipmentAPI = async (id: string) => {
  const res = await api.get(`/Shipment/${id}/shelf-items`);
  return res.data;
};
