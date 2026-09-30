"use client";

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
      className={`map-frame relative w-full overflow-hidden bg-surface-soft ${className}`}
    >
      <img
        src={imageSrc}
        alt={`Χάρτης: ${title}`}
        width={800}
        height={480}
        decoding="async"
        loading="eager"
        draggable={false}
        className="h-full w-full object-cover object-center select-none"
      />
    </div>
  );
}
