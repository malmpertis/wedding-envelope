import { MapButton } from "@/components/MapButton";
import { MapEmbed } from "@/components/MapEmbed";
import { wedding } from "@/content/wedding";
import { asset } from "@/lib/paths";

type LocationCardProps = {
  title: string;
  subtitle?: string;
  place: string;
  detail: string;
  mapImage: string;
  mapsUrl: string;
  iconSrc: string;
};

export function LocationCard({
  title,
  subtitle,
  place,
  detail,
  mapImage,
  mapsUrl,
  iconSrc,
}: LocationCardProps) {
  return (
    <section className="px-5 py-12 sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <img
          src={asset(iconSrc)}
          alt=""
          width={56}
          height={56}
          className="mb-5 opacity-70"
        />
        <h2 className="text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        <p className="mt-5 text-xl text-ink sm:text-2xl">{place}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft sm:text-base">
          {detail}
        </p>

        <div className="mt-8 w-full">
          <MapEmbed title={place} imageSrc={mapImage} />
        </div>

        <MapButton href={mapsUrl} label={wedding.mapLabel} />
      </div>
    </section>
  );
}
