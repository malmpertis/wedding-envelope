type LocationCardProps = {
  title: string;
  subtitle?: string;
  place: string;
  detail: string;
  embedUrl: string;
  mapsUrl: string;
  iconSrc: string;
  iconAlt: string;
};

export function LocationCard({
  title,
  subtitle,
  place,
  detail,
  embedUrl,
  mapsUrl,
  iconSrc,
  iconAlt,
}: LocationCardProps) {
  return (
    <section className="px-6 py-12 sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <img src={iconSrc} alt={iconAlt} width={56} height={56} className="mb-5 text-ink opacity-80" />
        <h2 className="font-serif text-3xl font-semibold tracking-wide text-ink sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-sm text-base text-ink-soft sm:text-lg">{subtitle}</p>
        ) : null}
        <p className="mt-5 font-serif text-xl text-ink sm:text-2xl">{place}</p>
        <p className="mt-1 text-sm tracking-wide text-ink-soft sm:text-base">{detail}</p>

        <div className="map-frame mt-8 w-full overflow-hidden rounded-sm bg-cream-warm">
          <iframe
            title={place}
            src={embedUrl}
            className="h-56 w-full border-0 sm:h-64"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-0.5 text-sm tracking-[0.16em] text-forest uppercase transition hover:text-gold-dark"
        >
          Οδηγίες
        </a>
      </div>
    </section>
  );
}
