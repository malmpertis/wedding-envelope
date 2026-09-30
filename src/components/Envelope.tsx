"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { wedding } from "@/content/wedding";
import { useInvitationAudio } from "@/components/AudioControls";
import { InvitationLetter } from "@/components/InvitationLetter";
import { WaxSeal } from "@/components/WaxSeal";

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const { unlockAndPlay } = useInvitationAudio();
  const [opened, setOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const open = () => {
    if (opened) return;
    try {
      unlockAndPlay();
    } catch {
      // Audio unlock is best-effort; never block opening.
    }
    if (reduceMotion) {
      setOpened(true);
      setShowLetter(true);
      return;
    }
    setOpened(true);
    window.setTimeout(() => setShowLetter(true), 900);
  };

  const close = () => {
    setShowLetter(false);
    setOpened(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-forest-deep">
      {!showLetter ? (
        <div className="relative flex min-h-dvh items-stretch justify-center md:items-center md:px-6 md:py-10">
          <div className="relative w-full max-w-none md:max-w-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 hidden scale-125 bg-[radial-gradient(ellipse_at_center,rgba(197,163,90,0.14),transparent_60%)] md:block"
            />

            <motion.div
              role="presentation"
              onClick={open}
              className="relative h-dvh w-full cursor-pointer overflow-hidden shadow-none md:h-auto md:aspect-[3/4.2] md:rounded-sm md:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
              style={{ perspective: 1200 }}
              initial={false}
              animate={
                opened ? { scale: 0.98, opacity: 0.35 } : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-forest-mid via-forest to-forest-deep" />

              <div className="absolute inset-x-[6%] top-[26%] bottom-[8%] bg-cream/90 sm:inset-x-[8%] sm:top-[28%] sm:bottom-[10%]" />

              <motion.div
                className="absolute inset-x-0 top-0 z-20 origin-top"
                style={{
                  height: "48%",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background:
                    "linear-gradient(160deg, #2a5644 0%, #1b3a2f 45%, #143028 100%)",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                }}
                animate={
                  opened
                    ? { rotateX: -160, opacity: 0.15, y: -40 }
                    : { rotateX: 0, opacity: 1, y: 0 }
                }
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              />

              <div
                aria-hidden
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to bottom right, transparent 49.5%, rgba(0,0,0,0.18) 50%, transparent 50.5%), linear-gradient(to bottom left, transparent 49.5%, rgba(0,0,0,0.18) 50%, transparent 50.5%)",
                  backgroundSize: "100% 55%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top",
                }}
              />

              <div className="gold-border-strip absolute inset-x-0 top-0 z-30 h-4 opacity-90 sm:h-5" />
              <div className="gold-border-strip absolute inset-x-0 bottom-0 z-30 h-4 opacity-90 sm:h-5" />

              <motion.button
                type="button"
                onClick={open}
                onPointerUp={open}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                  }
                }}
                disabled={opened}
                aria-label={wedding.openCta}
                className="absolute left-1/2 top-[46%] z-50 flex min-h-32 min-w-32 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:pointer-events-none disabled:cursor-default"
                whileHover={opened ? undefined : { scale: 1.04 }}
                whileTap={opened ? undefined : { scale: 0.97 }}
                animate={
                  opened
                    ? { scale: 0.6, opacity: 0, y: -30 }
                    : { scale: 1, opacity: 1, y: 0 }
                }
                transition={{ duration: 0.7 }}
              >
                <WaxSeal className="h-28 w-28 drop-shadow-xl sm:h-32 sm:w-32" size={128} />
              </motion.button>

              <div className="absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 px-5 pb-2 text-center sm:bottom-6 sm:px-6">
                <p className="font-script text-[1.35rem] leading-snug text-gold-light/90 sm:text-2xl">
                  {wedding.namesJoined}
                </p>
                <p className="mt-2 text-[0.65rem] tracking-[0.16em] text-cream/70 uppercase sm:text-[0.7rem] sm:tracking-[0.2em]">
                  {wedding.openCta}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="md:bg-[radial-gradient(ellipse_at_top,rgba(35,74,58,0.55),transparent_55%)]">
          <InvitationLetter onClose={close} />
        </div>
      )}
    </div>
  );
}
