import type { NextConfig } from "next";
const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  poweredByHeader: false,
  devIndicators: false,
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1536, 1920],
  },
};
export default nextConfig;
