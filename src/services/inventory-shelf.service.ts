import api from "../config/axios";

export const getInventoryShelfByLocationIdAPI = async <T>(
  id: string,
  params: T,
) => {
  const res = await api.get(`/InventoryShelf/location/${id}`, {
    params,
  });
  return res.data;
};
