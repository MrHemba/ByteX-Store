import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // Fotos de productos tomadas de los catálogos web de los proveedores (IDC y CEMCO)
      {
        protocol: "https",
        hostname: "www.idcmayoristas.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cemco.com.ec",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
