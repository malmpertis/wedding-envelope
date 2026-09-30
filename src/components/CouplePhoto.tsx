"use client";

import { useEffect, useRef } from "react";
import { wedding } from "@/content/wedding";

/**
 * Portrait with classic scroll parallax: the photo drifts slower than
 * the page inside a clipped frame, so it “slides” as you scroll past.
 */
export function CouplePhoto() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const update = () => {
      raf = 0;
      if (motionQuery.matches) {
        img.style.transform = "translate3d(0, 0, 0) scale(1.05)";
        return;
      }

      const rect = frame.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // Distance of frame center from viewport center
      const frameCenter = rect.top + rect.height / 2;
      const viewCenter = viewH / 2;
      const delta = frameCenter - viewCenter;
      // Image lags behind scroll (moves less than the page)
      const shift = delta * -0.28;
      img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.22)`;
    };

    const onScrollOrResize = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", onScrollOrResize);
    motionQuery.addEventListener?.("change", update);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      motionQuery.removeEventListener?.("change", update);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className="w-full">
      <div
        ref={frameRef}
        className="relative aspect-[4/5] w-full overflow-hidden bg-surface-soft sm:aspect-[5/4]"
      >
        <img
          ref={imgRef}
          src="/couple.jpg"
          alt={wedding.namesJoined}
          width={1080}
          height={1350}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="pointer-events-none absolute left-0 top-[-12%] h-[124%] w-full max-w-none object-cover object-[center_22%] will-change-transform"
          style={{ transform: "translate3d(0, 0, 0) scale(1.22)" }}
        />
      </div>
      <figcaption className="flex justify-center px-6 py-6 sm:px-10 sm:py-8">
        <img
          src="/welcome-script.png"
          alt="Welcome to our love story"
          width={777}
          height={223}
          decoding="async"
          className="h-auto w-full max-w-sm object-contain"
        />
      </figcaption>
    </figure>
  );
}
