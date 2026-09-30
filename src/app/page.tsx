"use client";

import { AudioProvider, MuteButton } from "@/components/AudioControls";
import { Envelope } from "@/components/Envelope";

export default function Home() {
  return (
    <AudioProvider>
      <main className="min-h-dvh bg-forest-deep">
        <Envelope />
        <MuteButton />
      </main>
    </AudioProvider>
  );
}
