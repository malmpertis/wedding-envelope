"use client";

import { useEffect, useState } from "react";
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
  const [remaining, setRemaining] = useState<Remaining>(() =>
    getRemaining(targetMs),
  );

  useEffect(() => {
    setRemaining(getRemaining(targetMs));
    const id = window.setInterval(() => {
      setRemaining(getRemaining(targetMs));
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const items = [
    { value: remaining.days, label: wedding.countdownLabels.days },
    { value: remaining.hours, label: wedding.countdownLabels.hours },
    { value: remaining.minutes, label: wedding.countdownLabels.minutes },
    { value: remaining.seconds, label: wedding.countdownLabels.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-live="polite">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.65rem] font-medium tracking-[0.18em] text-ink-soft sm:text-xs">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
