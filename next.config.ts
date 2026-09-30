import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // @ts-expect-error agentRules is supported by create-next-app tooling
  agentRules: false,
}

export default nextConfig;
