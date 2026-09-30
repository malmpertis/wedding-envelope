"use client";

import { wedding } from "@/content/wedding";

/** Full-bleed portrait beat — sits after the name hero, before countdown */
export function CouplePhoto() {
  return (
    <figure className="w-full">
      <div className="overflow-hidden">
        <img
          src="/couple.jpg"
          alt={wedding.namesJoined}
          width={1080}
          height={1350}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="aspect-[4/5] w-full object-cover object-[center_22%] sm:aspect-[5/4] sm:object-[center_18%]"
        />
      </div>
      <figcaption className="px-5 py-5 text-center font-script text-xl text-ink-soft sm:text-2xl">
        {wedding.welcomeScript}
      </figcaption>
    </figure>
  );
}
