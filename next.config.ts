import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1536, 1920],
  },
};
export default nextConfig;
