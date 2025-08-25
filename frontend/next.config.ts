import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.steamstatic.com",
        port: "",
        pathname: "/**",
      },
      // Добавь другие домены по необходимости
      {
        protocol: "https",
        hostname: "cdn.tradeit.gg",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "steamcdn-a.akamaihd.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
