"use client";

import { useState } from "react";
import { wedding } from "@/content/wedding";

export function CouplePhoto() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="mx-auto mt-10 flex aspect-[4/3] w-full max-w-sm items-center justify-center border border-gold/40 bg-gradient-to-br from-cream to-cream-warm shadow-inner">
        <div className="px-6 text-center">
          <img
            src="/icons/rings.svg"
            alt=""
            width={72}
            height={44}
            className="mx-auto mb-3 opacity-70"
          />
          <p className="font-script text-2xl text-ink-soft">
            {wedding.welcomeScript}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-sm overflow-hidden border border-gold/40 shadow-inner">
      <img
        src="/couple.jpg"
        alt={wedding.namesJoined}
        className="aspect-[4/3] w-full object-cover"
        onError={() => setFailed(true)}
      />
      <p className="bg-cream-warm/80 px-4 py-3 text-center font-script text-xl text-ink">
        {wedding.welcomeScript}
      </p>
    </div>
  );
}
