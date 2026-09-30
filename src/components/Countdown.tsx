"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  const secondsTotal = Math.floor(diff / 1000);
  return {
    days: Math.floor(secondsTotal / 86400),
    hours: Math.floor((secondsTotal % 86400) / 3600),
    minutes: Math.floor((secondsTotal % 3600) / 60),
    seconds: secondsTotal % 60,
  };
}

export function Countdown() {
  const targetMs = new Date(wedding.dateISO).getTime();
  const rootRef = useRef<HTMLDivElement>(null);
  const [remaining, setRemaining] = useState<Remaining>(() =>
    getRemaining(targetMs),
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let id = 0;
    const tick = () => setRemaining(getRemaining(targetMs));

    const start = () => {
      if (id) return;
      tick();
      id = window.setInterval(tick, 1000);
    };
    const stop = () => {
      if (!id) return;
      window.clearInterval(id);
      id = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { rootMargin: "80px 0px" },
    );
    observer.observe(root);

    return () => {
      stop();
      observer.disconnect();
    };
  }, [targetMs]);

  const items = [
    { value: remaining.days, label: wedding.countdownLabels.days },
    { value: remaining.hours, label: wedding.countdownLabels.hours },
    { value: remaining.minutes, label: wedding.countdownLabels.minutes },
    { value: remaining.seconds, label: wedding.countdownLabels.seconds },
  ];

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-4"
      aria-live="polite"
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 text-center">
          <div className="text-[1.65rem] font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="font-ui mt-1 text-[0.55rem] font-medium tracking-[0.12em] text-ink-soft sm:text-xs sm:tracking-[0.18em]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
