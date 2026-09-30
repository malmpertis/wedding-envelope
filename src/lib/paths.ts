/**
 * Public asset helper for GitHub Pages project sites.
 * Next basePath does not rewrite hardcoded "/foo" strings in <img>/fetch.
 */
export const BASE_PATH = (
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.__NEXT_ROUTER_BASEPATH ||
  ""
).replace(/\/$/, "");

/** Prefix a root-absolute public path with the deploy basePath when needed. */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
