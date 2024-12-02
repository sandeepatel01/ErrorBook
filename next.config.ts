import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
    serverComponentsExternalPackages: ["mongoose"],
    mdxRs: true,
  },
};

export default nextConfig;
