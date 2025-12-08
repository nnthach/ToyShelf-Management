import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dddn.1cdn.vn",
      },
    ],
  },
};

export default nextConfig;
