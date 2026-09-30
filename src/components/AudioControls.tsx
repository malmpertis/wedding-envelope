"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type AudioContextValue = {
  muted: boolean;
  unlocked: boolean;
  toggleMute: () => void;
  unlockAndPlay: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useInvitationAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useInvitationAudio must be used within AudioProvider");
  }
  return ctx;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const unlockAndPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setUnlocked(true);
    setMuted(false);
    audio.muted = false;
    void audio.play().catch(() => {
      setMuted(true);
      audio.muted = true;
    });
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!unlocked) {
      unlockAndPlay();
      return;
    }
    setMuted((prev) => {
      const next = !prev;
      audio.muted = next;
      if (!next) {
        void audio.play().catch(() => undefined);
      }
      return next;
    });
  }, [unlocked, unlockAndPlay]);

  return (
    <AudioCtx.Provider value={{ muted, unlocked, toggleMute, unlockAndPlay }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function MuteButton() {
  const { muted, toggleMute } = useInvitationAudio();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Ενεργοποίηση ήχου" : "Σίγαση ήχου"}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-forest-deep/55 text-cream shadow-lg backdrop-blur-sm transition hover:bg-forest-deep/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M11 5 L6 9 H3 V15 H6 L11 19 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M16 9 L21 15 M21 9 L16 15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M11 5 L6 9 H3 V15 H6 L11 19 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 8.5 C17.5 10.2 17.5 13.8 15.5 15.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M18.2 6 C21.5 8.8 21.5 15.2 18.2 18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
