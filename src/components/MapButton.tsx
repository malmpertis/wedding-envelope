type MapButtonProps = {
  href: string;
  label?: string;
};

export function MapButton({ href, label = "Χάρτης" }: MapButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-flex min-h-11 touch-manipulation items-center gap-2 border border-ink/25 bg-cream px-5 py-2 text-sm tracking-wide text-ink transition hover:border-gold hover:text-forest"
    >
      {label}
      <span aria-hidden className="text-base leading-none">
        →
      </span>
    </a>
  );
}
