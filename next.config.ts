import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 80, 85],
  },
};

export default nextConfig;
