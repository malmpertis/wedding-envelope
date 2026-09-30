import type { NextConfig } from "next";

/** Set in GitHub Actions for project Pages at /wedding-envelope. Leave unset for local / custom domain. */
const repoBase = "wedding-envelope";
const usePagesBase =
  process.env.GITHUB_PAGES === "true" || process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(usePagesBase
    ? { basePath: `/${repoBase}`, assetPrefix: `/${repoBase}/` }
    : {}),
};

export default nextConfig;
