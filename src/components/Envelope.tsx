"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { InvitationLetter } from "@/components/InvitationLetter";
import { Monogram } from "@/components/Monogram";
import { preloadInvitationAssets } from "@/lib/preload";

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "opening" | "letter">("idle");
  const [assetsReady, setAssetsReady] = useState(false);
  const [waitingOnAssets, setWaitingOnAssets] = useState(false);
  const openRequested = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  // Warm assets while the closed envelope is on screen
  useEffect(() => {
    let cancelled = false;
    preloadInvitationAssets().then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const finishOpen = useCallback(() => {
    clearTimers();
    if (reduceMotion) {
      setPhase("letter");
      return;
    }
    setPhase("opening");
    timers.current.push(
      window.setTimeout(() => setPhase("letter"), 1400),
    );
  }, [reduceMotion]);

  // If user tapped before preload finished, open as soon as ready
  useEffect(() => {
    if (assetsReady && openRequested.current && phase === "idle") {
      setWaitingOnAssets(false);
      finishOpen();
    }
  }, [assetsReady, phase, finishOpen]);

  useEffect(() => clearTimers, []);

  const requestOpen = () => {
    if (phase !== "idle") return;
    openRequested.current = true;
    if (!assetsReady) {
      setWaitingOnAssets(true);
      return;
    }
    finishOpen();
  };

  const close = () => {
    clearTimers();
    openRequested.current = false;
    setWaitingOnAssets(false);
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
  const statusLabel = waitingOnAssets
    ? "Φόρτωση…"
    : wedding.openCta;

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
            <div className="absolute inset-[10%] rounded-md bg-surface" />

            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
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
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2"
              animate={
                opening
                  ? { scale: 0.7, opacity: 0, y: -36 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Monogram size={108} />
            </motion.div>

            <motion.div
              className="absolute inset-x-0 bottom-10 z-10 px-6 text-center"
              animate={opening ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-script text-2xl text-ink sm:text-3xl">
                {wedding.namesJoined}
              </p>
              <p className="font-ui mt-3 text-[0.7rem] tracking-[0.22em] text-ink-soft uppercase">
                {wedding.dateShort}
              </p>
            </motion.div>
          </div>
        </button>

        {!opening ? (
          <p className="font-ui mt-6 text-center text-xs tracking-[0.18em] text-ink-soft uppercase">
            {statusLabel}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
