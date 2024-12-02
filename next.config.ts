import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // Retained as is
    mdxRs: true, // Retained as is
  },
  serverExternalPackages: ["mongoose"], // Replaces serverComponentsExternalPackages
};

export default nextConfig;
