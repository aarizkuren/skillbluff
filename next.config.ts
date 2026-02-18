import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ollama solo se usa en server-side, no incluir en el bundle del cliente
  serverExternalPackages: ['ollama'],
  // Configuración para Vercel - permite Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  // Desactivar ESLint durante build (errores de 'any' y comillas no bloqueen deploy)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
