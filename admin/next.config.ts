import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["../../modules", "../../shared"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
