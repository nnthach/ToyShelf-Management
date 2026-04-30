import api from "../config/axios";

export const productFileUploadAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); 

  const res = await api.post("/FileUpload/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, 
  });

  return res.data;
};

export const deleteFileUploadBySkuAPI = async (sku: string) => {
  const res = await api.delete(`/FileUpload/delete/${sku}`);
  return res.data;
};
