import api from "../config/axios";

export const productFileUploadAPI = async <T>(data: T) => {
  const res = await api.post("/FileUpload/upload", data);
  return res.data;
};

export const deleteFileUploadBySkuAPI = async (sku: string) => {
  const res = await api.delete(`/FileUpload/delete/${sku}`);
  return res.data;
};
