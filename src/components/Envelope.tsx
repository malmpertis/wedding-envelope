"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { wedding } from "@/content/wedding";
import { useInvitationAudio } from "@/components/AudioControls";
import { InvitationLetter } from "@/components/InvitationLetter";

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const { unlockAndPlay } = useInvitationAudio();
  const [opened, setOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const open = () => {
    if (opened) return;
    unlockAndPlay();
    if (reduceMotion) {
      setOpened(true);
      setShowLetter(true);
      return;
    }
    setOpened(true);
    window.setTimeout(() => setShowLetter(true), 900);
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-forest-deep">
      {!showLetter ? (
        <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
          <div className="relative w-full max-w-md">
            {/* Atmospheric glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 scale-125 bg-[radial-gradient(ellipse_at_center,rgba(197,163,90,0.12),transparent_60%)]"
            />

            <motion.div
              className="relative aspect-[3/4.2] w-full overflow-hidden rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
              style={{ perspective: 1200 }}
              initial={false}
              animate={opened ? { scale: 0.98, opacity: 0.35 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Envelope body */}
              <div className="absolute inset-0 bg-gradient-to-b from-forest-mid via-forest to-forest-deep" />

              {/* Paper hint behind flap */}
              <div className="absolute inset-x-[8%] top-[28%] bottom-[10%] bg-cream/90" />

              {/* Top flap */}
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

              {/* Side fold lines */}
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

              {/* Gold borders */}
              <div className="gold-border-strip absolute inset-x-0 top-0 z-30 h-5 opacity-90" />
              <div className="gold-border-strip absolute inset-x-0 bottom-0 z-30 h-5 opacity-90" />

              {/* Wax seal button */}
              <motion.button
                type="button"
                onClick={open}
                disabled={opened}
                aria-label={wedding.openCta}
                className="absolute left-1/2 top-[46%] z-40 -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-default"
                whileHover={opened ? undefined : { scale: 1.04 }}
                whileTap={opened ? undefined : { scale: 0.97 }}
                animate={
                  opened
                    ? { scale: 0.6, opacity: 0, y: -30 }
                    : { scale: 1, opacity: 1, y: 0 }
                }
                transition={{ duration: 0.7 }}
              >
                <img
                  src="/icons/wax-seal.svg"
                  alt=""
                  width={128}
                  height={128}
                  className="h-28 w-28 drop-shadow-xl sm:h-32 sm:w-32"
                  draggable={false}
                />
              </motion.button>

              <p className="absolute inset-x-0 bottom-12 z-30 px-6 text-center font-script text-xl text-gold-light/90 sm:text-2xl">
                {wedding.namesJoined}
              </p>
              <p className="absolute inset-x-0 bottom-6 z-30 px-6 text-center text-[0.7rem] tracking-[0.2em] text-cream/70 uppercase">
                {wedding.openCta}
              </p>
            </motion.div>
          </div>
        </div>
      ) : (
        <InvitationLetter />
      )}
    </div>
  );
}
