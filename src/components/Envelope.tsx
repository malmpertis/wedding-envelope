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
const CLOSE_MS = 950;
const ease = [0.22, 1, 0.36, 1] as const;

const ENVELOPE_BG = "#ebe4db";
const LETTER_BG = "#fffcf8";
/** Tight card lift — large blur blooms into a beige vignette as the sheet grows */
const SHADOW_ENVELOPE = "0 22px 44px rgb(23 20 18 / 0.12)";
const SHADOW_LETTER = "0 14px 32px rgb(23 20 18 / 0.08)";
const FLAP_GRADIENT = `linear-gradient(180deg, #f0e8de 0%, #e2d9cd 100%)`;
const FLAP_CLIP = "polygon(0 0, 100% 0, 50% 100%)";

type Phase = "idle" | "opening" | "open" | "closing";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function envelopeTargetRect(): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(vw - 32, vw >= 640 ? 448 : 352);
  const height = width * (4 / 3);
  const left = (vw - width) / 2;
  // Leave a little room for the CTA under the card
  const top = Math.max(24, (vh - height) / 2 - 18);
  return { top, left, width, height };
}

export function Envelope() {
  const reduceMotion = useReducedMotion();
  const { unlockAndPlay } = useInvitationAudio();
  const [phase, setPhase] = useState<Phase>("idle");
  const [criticalReady, setCriticalReady] = useState(false);
  const [closeFrom, setCloseFrom] = useState<Rect | null>(null);
  const [closeTo, setCloseTo] = useState<Rect | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const rafRef = useRef(0);
  const alive = useRef(true);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
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

    if (!criticalReady) {
      void preloadCriticalAssets().then(() => {
        if (alive.current) setCriticalReady(true);
      });
    }

    // Start the morph first; kick audio on the next frame so YouTube
    // work doesn’t contend with the opening layout on first tap.
    if (reduceMotion) {
      setPhase("open");
      schedule(() => unlockAndPlay(), 0);
      return;
    }

    setPhase("opening");
    schedule(() => setPhase("open"), EXPAND_MS);
    schedule(() => unlockAndPlay(), 120);
  };

  const close = () => {
    if (phase !== "open" && phase !== "opening") return;
    clearTimers();

    if (reduceMotion) {
      setPhase("idle");
      setCloseFrom(null);
      setCloseTo(null);
      window.scrollTo({ top: 0 });
      return;
    }

    // Measure the letter sheet first (while it still fills the page), then
    // FLIP-shrink that same rectangle down to the centered envelope.
    window.scrollTo({ top: 0 });

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      if (!alive.current) return;
      const node = sheetRef.current;
      const from = node?.getBoundingClientRect();
      if (!from || from.width < 8 || from.height < 8) {
        setPhase("idle");
        return;
      }

      setCloseFrom({
        top: from.top,
        left: from.left,
        width: from.width,
        height: from.height,
      });
      setCloseTo(envelopeTargetRect());
      setPhase("closing");
      schedule(() => {
        setPhase("idle");
        setCloseFrom(null);
        setCloseTo(null);
      }, CLOSE_MS);
    });
  };

  const idle = phase === "idle";
  const closing = phase === "closing";
  const sheetExpanded = phase === "opening" || phase === "open";
  const showLetter = sheetExpanded;
  const showOpeningFlap = phase === "opening";
  const layoutActive = phase === "idle" || phase === "opening";

  return (
    <div className="atmosphere relative min-h-dvh overflow-x-hidden">
      {/* Closing: keep a centered envelope-sized hole so the page doesn’t jump */}
      {closing && closeTo ? (
        <div className="flex min-h-dvh items-center justify-center px-4 py-8 md:px-8">
          <div
            aria-hidden
            className="invisible w-full max-w-[22rem] sm:max-w-md"
            style={{ aspectRatio: "3 / 4" }}
          />
        </div>
      ) : null}

      <div
        className={
          sheetExpanded
            ? "relative"
            : closing
              ? "pointer-events-none fixed inset-0 z-50"
              : "flex min-h-dvh items-center justify-center px-4 py-8 md:px-8"
        }
      >
        {/* Idle + open/opening share the in-flow sheet; closing uses a fixed FLIP layer */}
        {!closing ? (
          <motion.div
            layout={layoutActive}
            className={
              sheetExpanded
                ? "relative mx-auto w-full max-w-xl"
                : "relative w-full max-w-[22rem] sm:max-w-md"
            }
            transition={{ layout: { duration: EXPAND_MS / 1000, ease } }}
          >
            <motion.div
              ref={sheetRef}
              layout={layoutActive}
              className={
                sheetExpanded
                  ? `relative w-full overflow-x-clip bg-surface md:my-10 md:rounded-2xl md:ring-1 md:ring-black/5 ${
                      phase === "opening" ? "overflow-hidden" : ""
                    }`
                  : "relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface ring-1 ring-black/5"
              }
              initial={false}
              animate={{
                // Drop blur quickly on open so the expanding sheet doesn’t cast a
                // growing radial “beige to white” wash behind the letter.
                boxShadow: sheetExpanded ? SHADOW_LETTER : SHADOW_ENVELOPE,
              }}
              transition={{
                layout: { duration: EXPAND_MS / 1000, ease },
                boxShadow: { duration: 0.4, ease },
              }}
              style={idle || showOpeningFlap ? { perspective: 1400 } : undefined}
            >
              <AnimatePresence>
                {idle ? (
                  <motion.div
                    key="closed"
                    className="absolute inset-0 z-20"
                    initial={false}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease }}
                  >
                    <ClosedEnvelopeFace onOpen={requestOpen} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {showLetter ? (
                  <motion.div key="letter" initial={false} animate={{ opacity: 1 }}>
                    <InvitationLetter
                      onClose={close}
                      embedded
                      fromEnvelope
                      revealsReady={phase === "open"}
                      mountBody={phase === "open"}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {showOpeningFlap ? (
                  <motion.div
                    key="flap-open"
                    className="pointer-events-none absolute inset-x-0 top-0 z-40 origin-top"
                    style={{
                      height: "13rem",
                      clipPath: FLAP_CLIP,
                      background: FLAP_GRADIENT,
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
            </motion.div>

            <AnimatePresence>
              {idle ? (
                <motion.p
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-ui mt-6 text-center text-xs tracking-[0.18em] text-ink-soft uppercase"
                >
                  {wedding.openCta}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {/* Close FLIP: same sheet shrinks from letter bounds → envelope bounds */}
        <AnimatePresence>
          {closing && closeFrom && closeTo ? (
            <motion.div
              key="close-fly"
              className="overflow-hidden ring-1 ring-black/5"
              initial={{
                top: closeFrom.top,
                left: closeFrom.left,
                width: closeFrom.width,
                height: closeFrom.height,
                borderRadius: closeFrom.width >= 560 ? 16 : 0,
                boxShadow: SHADOW_LETTER,
              }}
              animate={{
                top: closeTo.top,
                left: closeTo.left,
                width: closeTo.width,
                height: closeTo.height,
                borderRadius: 20,
                boxShadow: SHADOW_ENVELOPE,
              }}
              transition={{ duration: CLOSE_MS / 1000, ease }}
              style={{
                position: "fixed",
                zIndex: 60,
                perspective: 1400,
                backgroundColor: LETTER_BG,
              }}
            >
              {/* Pocket + names fade in under the folding flap */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.28, ease }}
              >
                <ClosedEnvelopeFace decorative omitFlap />
              </motion.div>

              {/* Flap folds closed over the shrinking sheet */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-30 origin-top"
                style={{
                  height: "46%",
                  clipPath: FLAP_CLIP,
                  background: FLAP_GRADIENT,
                  boxShadow: "0 10px 24px rgb(23 20 18 / 0.1)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={{ rotateX: -170, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{
                  duration: FLAP_MS / 1000,
                  delay: 0.22,
                  ease,
                  opacity: { duration: 0.3, delay: 0.22 },
                }}
              />

              <motion.div
                className="pointer-events-none absolute left-1/2 top-[44%] z-40 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.72, opacity: 0, y: -36 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.42, ease }}
              >
                <Monogram size={108} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ClosedEnvelopeFace({
  onOpen,
  decorative = false,
  omitFlap = false,
}: {
  onOpen?: () => void;
  decorative?: boolean;
  omitFlap?: boolean;
}) {
  const inner = (
    <>
      {/* Envelope paper border — this layer fades with the face, so the open
          letter keeps its own surface and no page color swap happens. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: ENVELOPE_BG }}
      />

      <div className="absolute inset-[9%] flex flex-col justify-end rounded-md bg-surface px-5 pb-7 pt-6 shadow-[inset_0_0_0_1px_rgb(23_20_18/0.05)] sm:inset-[10%] sm:px-6 sm:pb-8">
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
        className="pointer-events-none absolute inset-0 z-[15] opacity-90"
        style={{
          background:
            "linear-gradient(to top right, transparent 49.2%, rgb(23 20 18 / 0.2) 50%, transparent 50.8%), linear-gradient(to top left, transparent 49.2%, rgb(23 20 18 / 0.2) 50%, transparent 50.8%)",
        }}
      />

      {!omitFlap ? (
        <>
          <div
            className="absolute inset-x-0 top-0 z-20 origin-top"
            style={{
              height: "46%",
              clipPath: FLAP_CLIP,
              background: FLAP_GRADIENT,
              boxShadow: "0 8px 20px rgb(23 20 18 / 0.08)",
            }}
          />
          <div className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2">
            <Monogram size={108} />
          </div>
        </>
      ) : null}
    </>
  );

  if (decorative) {
    return <div className="absolute inset-0">{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={wedding.openCta}
      className="absolute inset-0 cursor-pointer touch-manipulation text-left"
    >
      {inner}
    </button>
  );
}
