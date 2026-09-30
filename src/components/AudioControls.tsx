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
import { wedding } from "@/content/wedding";
import { loadYouTubeIframeAPI, type YTPlayer } from "@/lib/youtube";

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

const PLAYER_HOST_ID = "wedding-yt-audio";

export function AudioProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const wantSoundRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  const applyPlayback = useCallback((playUnmuted: boolean) => {
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(wedding.music.volume);
    if (playUnmuted) {
      player.unMute();
      player.playVideo();
    } else {
      player.mute();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let player: YTPlayer | null = null;

    const destroyPlayer = (instance: YTPlayer | null) => {
      if (!instance) return;
      try {
        instance.destroy();
      } catch {
        /* ignore */
      }
    };

    // Tear down any leftover host from a prior mount (Strict Mode / HMR)
    const stale = document.getElementById(PLAYER_HOST_ID);
    if (stale) {
      destroyPlayer(playerRef.current);
      playerRef.current = null;
      stale.remove();
    }

    const mount = document.createElement("div");
    mount.id = PLAYER_HOST_ID;
    mount.setAttribute("aria-hidden", "true");
    // Real iframe footprint off-screen — YouTube audio only, no visible video.
    mount.style.cssText =
      "position:fixed;width:240px;height:135px;left:-9999px;top:0;overflow:hidden;opacity:0;pointer-events:none;z-index:-1;";
    const target = document.createElement("div");
    mount.appendChild(target);
    document.body.appendChild(mount);

    void loadYouTubeIframeAPI()
      .then((YT) => {
        if (cancelled) return;
        player = new YT.Player(target, {
          videoId: wedding.music.youtubeVideoId,
          width: 240,
          height: 135,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            loop: 1,
            playlist: wedding.music.youtubeVideoId,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) {
                destroyPlayer(event.target);
                return;
              }
              playerRef.current = event.target;
              event.target.setVolume(wedding.music.volume);
              event.target.mute();
              if (wantSoundRef.current) {
                applyPlayback(true);
              }
            },
            onStateChange: (event) => {
              if (
                event.data === YT.PlayerState.ENDED &&
                wantSoundRef.current &&
                !cancelled
              ) {
                event.target.playVideo();
              }
            },
          },
        });
        if (cancelled) {
          destroyPlayer(player);
          player = null;
        }
      })
      .catch(() => {
        /* Mute control remains; playback no-ops until API loads */
      });

    return () => {
      cancelled = true;
      const current = playerRef.current ?? player;
      playerRef.current = null;
      destroyPlayer(current);
      mount.remove();
    };
  }, [applyPlayback]);

  const unlockAndPlay = useCallback(() => {
    wantSoundRef.current = true;
    setUnlocked(true);
    setMuted(false);
    applyPlayback(true);
  }, [applyPlayback]);

  const toggleMute = useCallback(() => {
    if (!unlocked) {
      unlockAndPlay();
      return;
    }
    setMuted((prev) => {
      const next = !prev;
      wantSoundRef.current = !next;
      const player = playerRef.current;
      if (player) {
        player.setVolume(wedding.music.volume);
        if (next) {
          player.mute();
        } else {
          player.unMute();
          player.playVideo();
        }
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
      title={muted ? "Ενεργοποίηση ήχου" : "Σίγαση ήχου"}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-ink/70 text-surface backdrop-blur-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
