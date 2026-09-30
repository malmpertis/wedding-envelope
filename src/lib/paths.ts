/**
 * Public asset URLs for static export.
 *
 * Use root-relative paths that include the deploy basePath when present.
 * Next does not rewrite hardcoded "/public/..." strings, and client bundles
 * do not always see next.config `env` — so we read the router basePath
 * inject and also accept NEXT_PUBLIC_BASE_PATH.
 */
function readBasePath(): string {
  const fromEnv = (
    process.env.NEXT_PUBLIC_BASE_PATH ||
    process.env.__NEXT_ROUTER_BASEPATH ||
    ""
  ).replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  // Client fallback: derive from the script URL Next loads under basePath
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

export const BASE_PATH = readBasePath();

/** Resolve a public file path (e.g. "/couple.jpg") for the current deploy. */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = readBasePath();
  return `${base}${normalized}`;
}
