/** Critical assets warmed during the envelope intro */
export const PRELOAD_ASSETS = [
  "/couple.png",
  "/welcome-script.png",
  "/icons/rings.svg",
  "/icons/church.svg",
  "/icons/venue.svg",
  "/audio/ambient.mp3",
] as const;

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block open on a missing asset
    img.src = src;
    if (img.complete) resolve();
  });
}

function loadFetch(src: string): Promise<void> {
  return fetch(src, { cache: "force-cache" })
    .then(() => undefined)
    .catch(() => undefined);
}

export function preloadInvitationAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const tasks = PRELOAD_ASSETS.map((src) => {
    if (src.endsWith(".svg") || src.endsWith(".jpg") || src.endsWith(".png") || src.endsWith(".webp")) {
      return loadImage(src);
    }
    return loadFetch(src);
  });

  return Promise.all(tasks).then(() => undefined);
}
