"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { useInvitationAudio } from "@/components/AudioControls";
import { InvitationLetter } from "@/components/InvitationLetter";
import { Monogram } from "@/components/Monogram";
import {
  preloadCriticalAssets,
  preloadSecondaryAssets,
} from "@/lib/preload";

const FLAP_MS = 620;
const EXPAND_MS = 900;
const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "idle" | "flipping" | "letter";

type Origin = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function letterTarget() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = Math.min(576, vw); // max-w-xl
  const left = Math.max(0, (vw - maxW) / 2);
  // Full-bleed on small screens; slight top inset on desktop like md:my-10
  const top = vw >= 768 ? 40 : 0;
  const height = Math.max(vh - top * (vw >= 768 ? 2 : 0), vh * 0.92);
  return { top, left, width: maxW, height };
}

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const { unlockAndPlay } = useInvitationAudio();
  const [phase, setPhase] = useState<Phase>("idle");
  const [criticalReady, setCriticalReady] = useState(false);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [target, setTarget] = useState<Origin | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const alive = useRef(true);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      if (alive.current) fn();
    }, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    preloadSecondaryAssets();
    preloadCriticalAssets().then(() => {
      if (!cancelled && alive.current) setCriticalReady(true);
    });
    return () => {
      cancelled = true;
      alive.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  // Keep desktop/mobile target in sync while expanding
  useLayoutEffect(() => {
    if (phase === "idle") return;
    const update = () => setTarget(letterTarget());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [phase]);

  const requestOpen = () => {
    if (phase !== "idle") return;
    unlockAndPlay();

    if (!criticalReady) {
      void preloadCriticalAssets().then(() => {
        if (alive.current) setCriticalReady(true);
      });
    }

    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect) {
      setPhase("letter");
      return;
    }

    const from: Origin = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    if (reduceMotion) {
      setOrigin(from);
      setTarget(letterTarget());
      setPhase("letter");
      return;
    }

    setOrigin(from);
    setTarget(letterTarget());
    setPhase("flipping");
    // Settle into normal document flow after the expand finishes
    schedule(() => setPhase("letter"), EXPAND_MS);
  };

  const close = () => {
    clearTimers();
    setPhase("idle");
    setOrigin(null);
    setTarget(null);
    window.scrollTo({ top: 0 });
  };

  const idle = phase === "idle";
  const flying = phase === "flipping";
  const settled = phase === "letter";

  return (
    <div className="atmosphere relative min-h-dvh overflow-x-hidden">
      {/* Closed envelope — leaves an invisible placeholder while flying so scroll doesn’t jump */}
      <div
        className={
          idle
            ? "flex min-h-dvh items-center justify-center px-4 py-8 md:px-8"
            : flying
              ? "min-h-dvh"
              : "relative"
        }
      >
        {idle || flying ? (
          <div
            ref={shellRef}
            className={
              idle
                ? "relative w-full max-w-[22rem] sm:max-w-md"
                : "pointer-events-none invisible relative mx-auto w-full max-w-[22rem] sm:max-w-md"
            }
            aria-hidden={flying || undefined}
          >
            {idle ? (
              <>
                <button
                  type="button"
                  onClick={requestOpen}
                  aria-label={wedding.openCta}
                  className="relative aspect-[3/4] w-full cursor-pointer touch-manipulation overflow-hidden rounded-[1.25rem] bg-[#ebe4db] text-left shadow-[0_24px_60px_rgb(23_20_18/0.14)] ring-1 ring-black/5"
                  style={{ perspective: 1400 }}
                >
                  <div className="absolute inset-[9%] flex flex-col justify-end rounded-md bg-surface px-5 pb-7 pt-6 sm:inset-[10%] sm:px-6 sm:pb-8">
                    <div className="text-center">
                      <p className="font-script text-2xl leading-snug text-ink sm:text-3xl">
                        {wedding.namesJoined}
                      </p>
                      <p className="font-ui mt-3 text-[0.7rem] tracking-[0.22em] text-ink-soft uppercase">
                        {wedding.dateShort}
                      </p>
                    </div>
                  </div>

                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[15] opacity-40"
                    style={{
                      background:
                        "linear-gradient(to top right, transparent 46%, rgb(23 20 18 / 0.06) 50%, transparent 54%), linear-gradient(to top left, transparent 46%, rgb(23 20 18 / 0.06) 50%, transparent 54%)",
                    }}
                  />

                  <div
                    className="absolute inset-x-0 top-0 z-20 origin-top"
                    style={{
                      height: "46%",
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                      boxShadow: "0 8px 20px rgb(23 20 18 / 0.08)",
                    }}
                  />

                  <div className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2">
                    <Monogram size={108} />
                  </div>
                </button>

                <p className="font-ui mt-6 text-center text-xs tracking-[0.18em] text-ink-soft uppercase">
                  {wedding.openCta}
                </p>
              </>
            ) : (
              <div className="aspect-[3/4] w-full" />
            )}
          </div>
        ) : null}

        {/* Flying / settled letter sheet */}
        <AnimatePresence>
          {flying && origin && target ? (
            <motion.div
              key="fly"
              className="fixed z-50 overflow-hidden bg-surface shadow-[0_24px_60px_rgb(23_20_18/0.16)] ring-1 ring-black/5"
              initial={{
                top: origin.top,
                left: origin.left,
                width: origin.width,
                height: origin.height,
                borderRadius: 20,
              }}
              animate={{
                top: target.top,
                left: target.left,
                width: target.width,
                height: target.height,
                borderRadius: target.width >= 576 ? 16 : 0,
              }}
              transition={{ duration: EXPAND_MS / 1000, ease }}
              style={{ position: "fixed" }}
            >
              {/* Flap lifts while the sheet is already growing */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-30 origin-top"
                style={{
                  height: "46%",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background:
                    "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                  boxShadow: "0 10px 24px rgb(23 20 18 / 0.12)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={{ rotateX: 0, opacity: 1 }}
                animate={{ rotateX: -172, opacity: 0 }}
                transition={{
                  duration: FLAP_MS / 1000,
                  ease,
                  opacity: { duration: 0.28, delay: 0.28 },
                }}
              />

              <motion.div
                className="pointer-events-none absolute left-1/2 top-[44%] z-40 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 1, opacity: 1, y: 0 }}
                animate={{ scale: 0.7, opacity: 0, y: -48 }}
                transition={{ duration: 0.4, ease }}
              >
                <Monogram size={108} />
              </motion.div>

              <motion.div
                className="h-full overflow-y-auto overscroll-contain"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease, delay: 0.12 }}
              >
                <InvitationLetter onClose={close} embedded />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {settled ? (
          <div className="relative mx-auto w-full max-w-xl overflow-hidden bg-surface md:my-10 md:rounded-2xl md:shadow-[0_20px_60px_rgb(23_20_18/0.1)] md:ring-1 md:ring-black/5">
            <InvitationLetter onClose={close} embedded />
          </div>
        ) : null}
      </div>
    </div>
  );
}
