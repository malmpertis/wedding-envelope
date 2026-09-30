import type { NextConfig } from "next";

/** Set in GitHub Actions for project Pages at /wedding-envelope. Leave unset for local / custom domain. */
const repoBase = "wedding-envelope";
const usePagesBase =
  process.env.GITHUB_PAGES === "true" || process.env.GITHUB_PAGES === "1";
const basePath = usePagesBase ? `/${repoBase}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Allow Cursor port-forward / tunnel hosts to load Next dev assets
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.trycloudflare.com"],
  env: {
    // Inlined into client bundles for asset("/…") helpers
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(usePagesBase ? { basePath, assetPrefix: `${basePath}/` } : {}),
};

export default nextConfig;
