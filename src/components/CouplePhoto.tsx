"use client";

import { useEffect, useRef } from "react";
import { wedding } from "@/content/wedding";
import { asset } from "@/lib/paths";

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
      const frameCenter = rect.top + rect.height / 2;
      const viewCenter = viewH / 2;
      const delta = frameCenter - viewCenter;
      // Gentle drift — faces sit lower in this portrait, keep them centered
      const shift = Math.min(12, Math.max(-48, -16 + delta * 0.14));
      img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.12)`;
    };

    const onScrollOrResize = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, {
      passive: true,
      capture: true,
    });
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
        <picture>
          <source srcSet={asset("/couple.webp")} type="image/webp" />
          <img
            ref={imgRef}
            src={asset("/couple.jpg")}
            alt={wedding.namesJoined}
            width={1086}
            height={1448}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="pointer-events-none absolute left-0 top-[-6%] h-[118%] w-full max-w-none object-cover object-[center_58%] will-change-transform"
            style={{ transform: "translate3d(0, -16px, 0) scale(1.12)" }}
          />
        </picture>
      </div>
      <figcaption className="flex justify-center px-6 py-6 sm:px-10 sm:py-8">
        <img
          src={asset("/welcome-script.png")}
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
