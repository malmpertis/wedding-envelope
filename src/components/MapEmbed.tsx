"use client";

import { useEffect, useState } from "react";

type MapEmbedProps = {
  title: string;
  src: string;
  className?: string;
};

/** Soft shell while the Google iframe paints */
export function MapEmbed({ title, src, className = "h-52 sm:h-64" }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`map-frame relative w-full overflow-hidden bg-surface-soft ${className}`}>
      {!loaded ? (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-soft via-[#efe8e0] to-surface-soft"
        />
      ) : null}
      <iframe
        title={title}
        src={src}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        className={`h-full w-full border-0 transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/** Start fetching map embeds as soon as the letter opens (not on scroll). */
export function MapWarmup({ urls }: { urls: readonly string[] }) {
  useEffect(() => {
    const nodes: HTMLIFrameElement[] = [];
    const unique = [...new Set(urls.filter(Boolean))];

    unique.forEach((src, index) => {
      window.setTimeout(() => {
        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.title = "map-warmup";
        iframe.setAttribute("aria-hidden", "true");
        iframe.tabIndex = -1;
        iframe.style.cssText =
          "position:absolute;width:1px;height:1px;left:-9999px;top:0;opacity:0;pointer-events:none;border:0;";
        document.body.appendChild(iframe);
        nodes.push(iframe);
      }, index * 180);
    });

    return () => {
      nodes.forEach((n) => n.remove());
    };
  }, [urls]);

  return null;
}
