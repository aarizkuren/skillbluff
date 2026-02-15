import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Configuración para Vercel - permite Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
};

export default nextConfig;
