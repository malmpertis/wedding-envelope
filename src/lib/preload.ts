import { asset } from "@/lib/paths";

/** Assets to warm while the envelope is closed */
export const CRITICAL_IMAGES = [
  asset("/couple.webp"),
  asset("/couple.jpg"),
  asset("/welcome-script.png"),
] as const;

export const SECONDARY_ASSETS = [
  asset("/icons/rings.svg"),
  asset("/icons/church.svg"),
  asset("/icons/venue.svg"),
  asset("/maps/ceremony.jpg"),
  asset("/maps/reception.jpg"),
  asset("/maps/prep-groom.jpg"),
  asset("/maps/prep-bride.jpg"),
] as const;

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
    if (img.complete) resolve();
  });
}

function loadFetch(src: string): Promise<void> {
  return fetch(src, { cache: "force-cache" })
    .then(() => undefined)
    .catch(() => undefined);
}

function loadOne(src: string): Promise<void> {
  if (/\.(svg|jpg|jpeg|png|webp)$/i.test(src)) return loadImage(src);
  return loadFetch(src);
}

/** Couple photo + caption — gate opening on these */
export function preloadCriticalAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return Promise.all(CRITICAL_IMAGES.map(loadOne)).then(() => undefined);
}

/** Icons/audio — nice to have, never block opening */
export function preloadSecondaryAssets(): void {
  if (typeof window === "undefined") return;
  void Promise.all(SECONDARY_ASSETS.map(loadOne));
}

/** @deprecated use preloadCriticalAssets + preloadSecondaryAssets */
export function preloadInvitationAssets(): Promise<void> {
  preloadSecondaryAssets();
  return preloadCriticalAssets();
}
