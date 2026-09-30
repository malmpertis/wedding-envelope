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

const FLAP_MS = 640;
const EXPAND_MS = 1000;
const CLOSE_MS = 1000;
const ease = [0.22, 1, 0.36, 1] as const;

const ENVELOPE_BG = "#ebe4db";
const LETTER_BG = "#fffcf8";

type Phase = "idle" | "opening" | "open" | "closing";

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
      setPhase("open");
      return;
    }

    setPhase("opening");
    schedule(() => setPhase("open"), EXPAND_MS);
  };

  const close = () => {
    if (phase !== "open" && phase !== "opening") return;
    clearTimers();

    // Start the reverse morph from the top of the letter
    window.scrollTo({ top: 0 });

    if (reduceMotion) {
      setPhase("idle");
      return;
    }

    // Let scroll apply before Framer measures layout
    requestAnimationFrame(() => {
      if (!alive.current) return;
      setPhase("closing");
      schedule(() => setPhase("idle"), CLOSE_MS);
    });
  };

  const idle = phase === "idle";
  const closing = phase === "closing";
  const sheetExpanded = phase === "opening" || phase === "open";
  const showLetter =
    phase === "opening" || phase === "open" || phase === "closing";
  const showClosedFace = idle || closing;
  const showOpeningFlap = phase === "opening";
  const showClosingFlap = closing;
  // Layout on while morphing or idle (idle keeps prior bounds for the next open)
  const layoutActive = phase !== "open";

  return (
    <div className="atmosphere relative min-h-dvh overflow-x-hidden">
      <div
        className={
          sheetExpanded
            ? "relative"
            : "flex min-h-dvh items-center justify-center px-4 py-8 md:px-8"
        }
      >
        <motion.div
          layout={layoutActive}
          className={
            sheetExpanded
              ? "relative mx-auto w-full max-w-xl"
              : "relative w-full max-w-[22rem] sm:max-w-md"
          }
          transition={{
            layout: {
              duration: (sheetExpanded ? EXPAND_MS : CLOSE_MS) / 1000,
              ease,
            },
          }}
        >
          <motion.div
            layout={layoutActive}
            className={
              sheetExpanded
                ? `relative w-full md:my-10 md:rounded-2xl md:shadow-[0_20px_60px_rgb(23_20_18/0.1)] md:ring-1 md:ring-black/5 ${
                    phase === "opening" || closing
                      ? "overflow-hidden"
                      : "overflow-x-clip"
                  }`
                : "relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_rgb(23_20_18/0.14)] ring-1 ring-black/5"
            }
            initial={false}
            animate={{
              backgroundColor: sheetExpanded ? LETTER_BG : ENVELOPE_BG,
            }}
            transition={{
              layout: {
                duration: (sheetExpanded ? EXPAND_MS : CLOSE_MS) / 1000,
                ease,
              },
              backgroundColor: { duration: 0.7, ease },
            }}
            style={
              idle || closing || showOpeningFlap
                ? { perspective: 1400 }
                : undefined
            }
          >
            <AnimatePresence>
              {showClosedFace ? (
                <motion.div
                  key="closed"
                  className="absolute inset-0 z-20"
                  initial={closing ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: closing ? 0.45 : 0.28,
                    delay: closing ? 0.35 : 0,
                    ease,
                  }}
                >
                  <button
                    type="button"
                    onClick={requestOpen}
                    disabled={!idle}
                    aria-label={wedding.openCta}
                    className="absolute inset-0 touch-manipulation text-left enabled:cursor-pointer disabled:cursor-default"
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

                    {/* Static flap while idle; animated flap handles close/open */}
                    {idle ? (
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
                    ) : null}

                    {idle ? (
                      <div className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2">
                        <Monogram size={108} />
                      </div>
                    ) : null}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showLetter ? (
                <motion.div
                  key="letter"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0.55 }}
                  animate={{ opacity: closing ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: closing ? 0.4 : 0.45,
                    ease,
                  }}
                >
                  <InvitationLetter
                    onClose={close}
                    embedded
                    fromEnvelope
                    revealsReady={phase === "open"}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Open: flap lifts away */}
            <AnimatePresence>
              {showOpeningFlap ? (
                <motion.div
                  key="flap-open"
                  className="pointer-events-none absolute inset-x-0 top-0 z-40 origin-top"
                  style={{
                    height: "13rem",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background:
                      "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                    boxShadow: "0 10px 24px rgb(23 20 18 / 0.1)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  initial={{ rotateX: 0, opacity: 1 }}
                  animate={{ rotateX: -170, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: FLAP_MS / 1000,
                    ease,
                    opacity: { duration: 0.28, delay: 0.3 },
                  }}
                />
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showOpeningFlap ? (
                <motion.div
                  key="seal-open"
                  className="pointer-events-none absolute left-1/2 top-[11.25rem] z-50 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 1, opacity: 1, y: 0 }}
                  animate={{ scale: 0.72, opacity: 0, y: -36 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, ease }}
                >
                  <Monogram size={96} />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Close: flap folds back down over the shrinking sheet */}
            <AnimatePresence>
              {showClosingFlap ? (
                <motion.div
                  key="flap-close"
                  className="pointer-events-none absolute inset-x-0 top-0 z-40 origin-top"
                  style={{
                    height: "46%",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background:
                      "linear-gradient(180deg, #f4eee6 0%, #e5ddd2 100%)",
                    boxShadow: "0 10px 24px rgb(23 20 18 / 0.1)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  initial={{ rotateX: -170, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{
                    duration: FLAP_MS / 1000,
                    delay: 0.2,
                    ease,
                    opacity: { duration: 0.35, delay: 0.2 },
                  }}
                />
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showClosingFlap ? (
                <motion.div
                  key="seal-close"
                  className="pointer-events-none absolute left-1/2 top-[44%] z-50 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0.72, opacity: 0, y: -36 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.4, ease }}
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
                transition={{ duration: 0.25, delay: 0.05 }}
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
