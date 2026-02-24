import api from "../config/axios";

export const getAllProducePriceSegmentAPI = async <T>(params: T) => {
  const res = await api.get("/PriceSegment", { params });
  return res.data;
};

export const getProducePriceSegmentDetailAPI = async (id: string) => {
  const res = await api.get(`/PriceSegment/${id}`);
  return res.data;
};

export const createProducePriceSegmentAPI = async <T>(data: T) => {
  const res = await api.post("/PriceSegment", data);
  return res.data;
};

export const updateProducePriceSegmentAPI = async <T>(id: string, data: T) => {
  const res = await api.put(`/PriceSegment/${id}`, data);
  return res.data;
};

export const deleteProducePriceSegmentAPI = async (id: string) => {
  const res = await api.delete(`/PriceSegment/${id}/delete`);
  return res.data;
};
