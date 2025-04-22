import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@neondatabase/serverless'],
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
