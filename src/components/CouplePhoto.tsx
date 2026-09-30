"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { wedding } from "@/content/wedding";

/** Full-bleed portrait with a soft scroll parallax */
export function CouplePhoto() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-48, 48],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1.14, 1],
  );

  return (
    <figure ref={ref} className="w-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4]">
        <motion.img
          src="/couple.jpg"
          alt={wedding.namesJoined}
          width={1080}
          height={1350}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          style={{ y, scale }}
          className="absolute inset-x-0 top-[-12%] h-[125%] w-full object-cover object-[center_22%] will-change-transform"
        />
      </div>
      <figcaption className="px-5 py-5 text-center font-script text-xl text-ink-soft sm:text-2xl">
        {wedding.welcomeScript}
      </figcaption>
    </figure>
  );
}
