import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['pdfjs-dist'], // 👈 important pour le bundler
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wokpbajmuatqykbcsjmv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
