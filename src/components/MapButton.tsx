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
      className="font-ui mt-5 inline-flex min-h-11 touch-manipulation items-center gap-2 border border-[var(--line)] bg-surface px-5 py-2 text-sm tracking-wide text-ink transition hover:border-accent hover:text-accent"
    >
      {label}
      <span aria-hidden className="text-base leading-none">
        →
      </span>
    </a>
  );
}
