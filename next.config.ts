import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local proxy software may resolve public CDN hosts to 198.18.0.0/15.
    // Keep this exception development-only so production retains SSRF protection.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
