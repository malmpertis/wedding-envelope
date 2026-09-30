"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { InvitationLetter } from "@/components/InvitationLetter";
import { Monogram } from "@/components/Monogram";
import {
  preloadCriticalAssets,
  preloadSecondaryAssets,
} from "@/lib/preload";

const OPEN_ANIM_MS = 850;

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "opening" | "letter">("idle");
  const [criticalReady, setCriticalReady] = useState(false);
  const openRequested = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    let cancelled = false;
    preloadSecondaryAssets();
    preloadCriticalAssets().then(() => {
      if (!cancelled) setCriticalReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const showLetter = useCallback(() => {
    setPhase("letter");
  }, []);

  const finishOpen = useCallback(() => {
    clearTimers();
    if (reduceMotion) {
      showLetter();
      return;
    }
    setPhase("opening");
    timers.current.push(window.setTimeout(showLetter, OPEN_ANIM_MS));
  }, [reduceMotion, showLetter]);

  // Tap happened before preload finished — open as soon as critical assets are ready
  useEffect(() => {
    if (criticalReady && openRequested.current && phase === "idle") {
      finishOpen();
    }
  }, [criticalReady, phase, finishOpen]);

  useEffect(() => clearTimers, []);

  const requestOpen = () => {
    if (phase !== "idle") return;
    openRequested.current = true;
    const startedAt = performance.now();

    // Always start the flap immediately so the UI doesn't feel stuck
    if (reduceMotion) {
      void (criticalReady
        ? Promise.resolve()
        : Promise.race([
            preloadCriticalAssets().then(() => setCriticalReady(true)),
            new Promise<void>((r) => {
              timers.current.push(window.setTimeout(r, 400));
            }),
          ])
      ).then(showLetter);
      return;
    }

    setPhase("opening");

    const ready = criticalReady
      ? Promise.resolve()
      : Promise.race([
          preloadCriticalAssets().then(() => setCriticalReady(true)),
          new Promise<void>((r) => {
            timers.current.push(window.setTimeout(r, 450));
          }),
        ]);

    void ready.then(() => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, OPEN_ANIM_MS - elapsed);
      timers.current.push(window.setTimeout(showLetter, remaining));
    });
  };

  const close = () => {
    clearTimers();
    openRequested.current = false;
    setPhase("idle");
    window.scrollTo({ top: 0 });
  };

  if (phase === "letter") {
    return (
      <div className="atmosphere relative min-h-dvh overflow-x-hidden">
        <InvitationLetter onClose={close} />
      </div>
    );
  }

  const opening = phase === "opening";

  return (
    <div className="atmosphere relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 md:px-8">
      <motion.div
        className="relative w-full max-w-[22rem] sm:max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={requestOpen}
          disabled={opening}
          aria-label={wedding.openCta}
          className="relative mx-auto block aspect-[3/4] w-full cursor-pointer touch-manipulation text-left disabled:cursor-default"
          style={{ perspective: "1400px" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[1.25rem] bg-[#ebe4db] shadow-[0_24px_60px_rgb(23_20_18/0.14)] ring-1 ring-black/5">
            <div className="absolute inset-[9%] flex flex-col justify-end rounded-md bg-surface px-5 pb-7 pt-6 sm:inset-[10%] sm:px-6 sm:pb-8">
              <motion.div
                className="relative z-10 text-center"
                animate={opening ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <p className="font-script text-2xl leading-snug text-ink sm:text-3xl">
                  {wedding.namesJoined}
                </p>
                <p className="font-ui mt-3 text-[0.7rem] tracking-[0.22em] text-ink-soft uppercase">
                  {wedding.dateShort}
                </p>
              </motion.div>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[15] opacity-40"
              style={{
                background:
                  "linear-gradient(to top right, transparent 46%, rgb(23 20 18 / 0.06) 50%, transparent 54%), linear-gradient(to top left, transparent 46%, rgb(23 20 18 / 0.06) 50%, transparent 54%)",
              }}
            />

            <motion.div
              className="absolute inset-x-0 top-0 z-20 origin-top"
              style={{
                height: "46%",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                boxShadow: "0 8px 20px rgb(23 20 18 / 0.08)",
              }}
              animate={
                opening
                  ? { rotateX: -168, y: -12, opacity: 0.35 }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2"
              animate={
                opening
                  ? { scale: 0.7, opacity: 0, y: -36 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Monogram size={108} />
            </motion.div>
          </div>
        </button>

        {!opening ? (
          <p className="font-ui mt-6 text-center text-xs tracking-[0.18em] text-ink-soft uppercase">
            {wedding.openCta}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
