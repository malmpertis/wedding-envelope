"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { wedding } from "@/content/wedding";

/** Full-bleed portrait with scroll parallax + script caption graphic */
export function CouplePhoto() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // 0 when section enters bottom, 1 when it leaves top
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      const shift = (clamped - 0.5) * 120; // px
      const scale = 1.18;
      img.style.transform = `translate3d(0, ${shift}px, 0) scale(${scale})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <figure className="w-full">
      <div
        ref={frameRef}
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4]"
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
          className="absolute inset-x-0 top-[-15%] h-[130%] w-full object-cover object-[center_22%] will-change-transform"
        />
      </div>
      <figcaption className="flex justify-center px-6 py-6 sm:px-10 sm:py-8">
        <img
          src="/welcome-script.png"
          alt="Welcome to our love story"
          width={800}
          height={200}
          decoding="async"
          className="h-auto w-full max-w-sm object-contain"
        />
      </figcaption>
    </figure>
  );
}
