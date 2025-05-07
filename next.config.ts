import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['api.dicebear.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com/**",
      },
    ],
  },
  // if used turbopack
  // transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
