"use client";

import { wedding } from "@/content/wedding";

export function CouplePhoto() {
  return (
    <figure className="w-full overflow-hidden">
      <img
        src="/couple.jpg"
        alt={wedding.namesJoined}
        width={1080}
        height={1350}
        decoding="async"
        // Preloaded during envelope intro — keep eager so first paint is instant
        loading="eager"
        fetchPriority="high"
        className="aspect-[4/5] w-full object-cover object-[center_22%] md:aspect-[5/4] md:object-[center_18%]"
      />
      <figcaption className="border-b border-[var(--line)] bg-surface px-4 py-4 text-center font-script text-xl text-ink sm:text-2xl">
        {wedding.welcomeScript}
      </figcaption>
    </figure>
  );
}
