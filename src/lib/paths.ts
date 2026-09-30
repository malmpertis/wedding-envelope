/**
 * Public asset URLs for static export.
 *
 * Next does not rewrite hardcoded "/…" strings in client components, so we
 * resolve the deploy basePath from NEXT_PUBLIC_BASE_PATH / the router inject,
 * with a document script fallback for GitHub Pages project sites.
 */
function readBasePath(): string {
  const fromEnv = (
    process.env.NEXT_PUBLIC_BASE_PATH ||
    process.env.__NEXT_ROUTER_BASEPATH ||
    ""
  ).replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (typeof document !== "undefined") {
    const script = document.querySelector(
      'script[src*="/_next/"]',
    ) as HTMLScriptElement | null;
    const src = script?.src || "";
    const marker = "/_next/";
    const idx = src.indexOf(marker);
    if (idx > 0) {
      try {
        const path = new URL(src).pathname;
        const base = path.slice(0, path.indexOf(marker));
        return base.replace(/\/$/, "");
      } catch {
        /* ignore */
      }
    }
  }
  return "";
}

/** Resolve a public file path (e.g. "/couple.jpg") for the current deploy. */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${readBasePath()}${normalized}`;
}
