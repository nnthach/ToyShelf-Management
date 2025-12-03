import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["dddn.1cdn.vn"], // thêm domain ảnh bên ngoài bạn muốn load
  },
};

export default nextConfig;
