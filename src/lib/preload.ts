import { asset } from "@/lib/paths";

/** Assets to warm while the envelope is closed */
const CRITICAL_IMAGES = [
  asset("/couple.webp"),
  asset("/couple.jpg"),
  asset("/welcome-script.png"),
] as const;

const SECONDARY_ASSETS = [
  asset("/icons/rings.svg"),
  asset("/icons/church.svg"),
  asset("/icons/venue.svg"),
  asset("/venues/church.webp"),
  asset("/venues/reception.webp"),
  asset("/maps/ceremony.jpg"),
  asset("/maps/reception.jpg"),
  asset("/maps/prep-groom.jpg"),
  asset("/maps/prep-bride.jpg"),
] as const;

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";

    const finish = () => {
      if (typeof img.decode === "function") {
        void img
          .decode()
          .catch(() => undefined)
          .finally(() => resolve());
        return;
      }
      resolve();
    };

    img.onload = finish;
    img.onerror = () => resolve();
    img.src = src;
    if (img.complete) finish();
  });
}

/** Couple photo + caption — warm + decode before / during first open */
export function preloadCriticalAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return Promise.all(CRITICAL_IMAGES.map(loadImage)).then(() => undefined);
}

/** Icons / maps — nice to have, never block opening */
export function preloadSecondaryAssets(): void {
  if (typeof window === "undefined") return;
  void Promise.all(SECONDARY_ASSETS.map(loadImage));
}
