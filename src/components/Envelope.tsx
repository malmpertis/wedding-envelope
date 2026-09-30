"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { useInvitationAudio } from "@/components/AudioControls";
import { InvitationLetter } from "@/components/InvitationLetter";
import { Monogram } from "@/components/Monogram";
import {
  preloadCriticalAssets,
  preloadSecondaryAssets,
} from "@/lib/preload";

const FLAP_MS = 680;
const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "idle" | "opening" | "letter";

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const { unlockAndPlay } = useInvitationAudio();
  const [phase, setPhase] = useState<Phase>("idle");
  const [criticalReady, setCriticalReady] = useState(false);
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

  const requestOpen = () => {
    if (phase !== "idle") return;
    unlockAndPlay();

    if (!criticalReady) {
      void preloadCriticalAssets().then(() => {
        if (alive.current) setCriticalReady(true);
      });
    }

    if (reduceMotion) {
      setPhase("letter");
      return;
    }

    // Flap + expand start on the same frame — no parked pocket.
    setPhase("opening");
    schedule(() => setPhase("letter"), FLAP_MS);
  };

  const close = () => {
    clearTimers();
    setPhase("idle");
    window.scrollTo({ top: 0 });
  };

  const idle = phase === "idle";
  const expanding = phase !== "idle";
  const showFlap = phase === "opening";

  return (
    <div className="atmosphere relative min-h-dvh overflow-x-hidden">
      <motion.div
        className={
          expanding
            ? "relative px-0"
            : "flex min-h-dvh items-center justify-center px-4 py-8 md:px-8"
        }
        layout
        transition={{ layout: { duration: 0.85, ease } }}
      >
        <motion.div
          layout
          className={
            expanding
              ? "relative mx-auto w-full max-w-xl"
              : "relative w-full max-w-[22rem] sm:max-w-md"
          }
          transition={{ layout: { duration: 0.85, ease } }}
        >
          <motion.div
            layout
            className={
              expanding
                ? "relative w-full overflow-hidden bg-surface md:my-10 md:rounded-2xl md:shadow-[0_20px_60px_rgb(23_20_18/0.1)] md:ring-1 md:ring-black/5"
                : "relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-[#ebe4db] shadow-[0_24px_60px_rgb(23_20_18/0.14)] ring-1 ring-black/5"
            }
            transition={{ layout: { duration: 0.85, ease } }}
            style={idle ? { perspective: 1400 } : undefined}
          >
            <AnimatePresence mode="popLayout">
              {idle ? (
                <motion.div
                  key="closed"
                  className="absolute inset-0 z-20"
                  initial={false}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease }}
                >
                  <button
                    type="button"
                    onClick={requestOpen}
                    aria-label={wedding.openCta}
                    className="absolute inset-0 cursor-pointer touch-manipulation text-left"
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
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  className="relative z-10"
                  initial={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0.35, y: 36, scale: 0.96 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease }}
                >
                  <InvitationLetter onClose={close} embedded />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flap lifts off the expanding sheet (opening phase only) */}
            <AnimatePresence>
              {showFlap ? (
                <motion.div
                  key="flap"
                  className="pointer-events-none absolute inset-x-0 top-0 z-40 origin-top"
                  style={{
                    height: "13.5rem",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background:
                      "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                    boxShadow: "0 10px 24px rgb(23 20 18 / 0.12)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  initial={{ rotateX: 0, opacity: 1, y: 0 }}
                  animate={{ rotateX: -170, opacity: 0, y: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: FLAP_MS / 1000,
                    ease,
                    opacity: { duration: 0.3, delay: 0.3 },
                  }}
                />
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showFlap ? (
                <motion.div
                  key="seal"
                  className="pointer-events-none absolute left-1/2 top-[11.5rem] z-50 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 1, opacity: 1, y: 0 }}
                  animate={{ scale: 0.7, opacity: 0, y: -40 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <Monogram size={108} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {idle ? (
              <motion.p
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="font-ui mt-6 text-center text-xs tracking-[0.18em] text-ink-soft uppercase"
              >
                {wedding.openCta}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
