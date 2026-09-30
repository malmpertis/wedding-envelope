"use client";

import { asset } from "@/lib/paths";

type MapEmbedProps = {
  title: string;
  /** Static map image in /public/maps */
  imageSrc: string;
  className?: string;
};

/** Non-interactive map preview — pin centered; details via Χάρτης link */
export function MapEmbed({
  title,
  imageSrc,
  className = "h-52 sm:h-64",
}: MapEmbedProps) {
  return (
    <div
      className={`map-frame relative w-full touch-none overflow-hidden bg-surface-soft pointer-events-none ${className}`}
    >
      <img
        src={asset(imageSrc)}
        alt={`Χάρτης: ${title}`}
        width={1125}
        height={600}
        decoding="async"
        loading="lazy"
        draggable={false}
        className="pointer-events-none h-full w-full select-none object-cover object-center"
      />
    </div>
  );
}
