import api from "../config/axios";

export const getAllStores = async <T>(params: T) => {
  const res = await api.get("/stores", { params });
  return res.data;
};

export const createStore = async <T>(data: T) => {
  const res = await api.post("/store", data);
  return res.data;
};
