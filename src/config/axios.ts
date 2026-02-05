"use client";
import axios from "axios";

// Tạo instance chung
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung (401, 403, 500...)
    if (error.response?.status === 401) {
      // Có thể redirect về /login hoặc refresh token
    }

    return Promise.reject(error);
  },
);

export default api;
