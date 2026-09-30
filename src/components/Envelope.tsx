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

/** Flap lift duration */
const FLAP_MS = 950;
/** After flap starts, begin expanding into the letter */
const EXPAND_DELAY_MS = 520;
/** Soft settle after the letter surface is in place */
const SETTLE_MS = 380;

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

  const showLetter = useCallback(() => {
    if (!alive.current) return;
    setPhase("letter");
  }, []);

  const requestOpen = () => {
    if (phase !== "idle") return;
    unlockAndPlay();

    if (reduceMotion) {
      void (criticalReady
        ? Promise.resolve()
        : Promise.race([
            preloadCriticalAssets().then(() => {
              if (alive.current) setCriticalReady(true);
            }),
            new Promise<void>((r) => schedule(r, 350)),
          ])
      ).then(showLetter);
      return;
    }

    setPhase("opening");

    const ready = criticalReady
      ? Promise.resolve()
      : Promise.race([
          preloadCriticalAssets().then(() => {
            if (alive.current) setCriticalReady(true);
          }),
          new Promise<void>((r) => schedule(r, 450)),
        ]);

    void ready.then(() => {
      if (!alive.current) return;
      // Expand into the letter while the flap is still finishing its arc
      schedule(showLetter, EXPAND_DELAY_MS);
    });
  };

  const close = () => {
    clearTimers();
    setPhase("idle");
    window.scrollTo({ top: 0 });
  };

  const opening = phase === "opening";
  const open = phase === "letter";
  const flapUp = opening || open;

  return (
    <div className="atmosphere relative min-h-dvh overflow-x-hidden">
      <div
        className={
          open
            ? "relative"
            : "flex min-h-dvh items-center justify-center px-4 py-8 md:px-8"
        }
      >
        <motion.div
          layout
          className={
            open
              ? "relative mx-auto w-full max-w-xl"
              : "relative w-full max-w-[22rem] sm:max-w-md"
          }
          transition={{ layout: { duration: 0.9, ease } }}
        >
          <motion.div
            layout
            className={
              open
                ? "relative w-full overflow-hidden bg-surface md:my-10 md:rounded-2xl md:shadow-[0_20px_60px_rgb(23_20_18/0.1)] md:ring-1 md:ring-black/5"
                : "relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-[#ebe4db] shadow-[0_24px_60px_rgb(23_20_18/0.14)] ring-1 ring-black/5"
            }
            transition={{ layout: { duration: 0.9, ease } }}
            style={open ? undefined : { perspective: 1400 }}
          >
            {/* Envelope face — fades as the sheet expands into the letter */}
            <AnimatePresence>
              {!open ? (
                <motion.div
                  key="envelope-face"
                  className="absolute inset-0"
                  initial={false}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <button
                    type="button"
                    onClick={requestOpen}
                    disabled={opening}
                    aria-label={wedding.openCta}
                    className="absolute inset-0 cursor-pointer touch-manipulation text-left disabled:cursor-default"
                  >
                    <div className="absolute inset-[9%] flex flex-col justify-end rounded-md bg-surface px-5 pb-7 pt-6 sm:inset-[10%] sm:px-6 sm:pb-8">
                      <motion.div
                        className="relative z-10 text-center"
                        animate={
                          flapUp
                            ? { opacity: 0, y: 16 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={{ duration: 0.5, ease }}
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
                        background:
                          "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                        boxShadow: "0 8px 20px rgb(23 20 18 / 0.08)",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                      animate={
                        flapUp
                          ? { rotateX: -172, y: -18, opacity: 0 }
                          : { rotateX: 0, y: 0, opacity: 1 }
                      }
                      transition={{
                        duration: FLAP_MS / 1000,
                        ease,
                        opacity: { duration: 0.55, delay: flapUp ? 0.35 : 0 },
                      }}
                    />

                    <motion.div
                      className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2"
                      animate={
                        flapUp
                          ? { scale: 0.72, opacity: 0, y: -40 }
                          : { scale: 1, opacity: 1, y: 0 }
                      }
                      transition={{ duration: 0.65, ease }}
                    >
                      <Monogram size={108} />
                    </motion.div>
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Letter grows out of the same sheet */}
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="letter"
                  initial={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 18, scale: 0.985 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.75,
                    delay: reduceMotion ? 0 : SETTLE_MS / 1000,
                    ease,
                  }}
                >
                  <InvitationLetter onClose={close} embedded />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {phase === "idle" ? (
              <motion.p
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="font-ui mt-6 text-center text-xs tracking-[0.18em] text-ink-soft uppercase"
              >
                {wedding.openCta}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
