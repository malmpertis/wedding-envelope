"use client";

import { wedding } from "@/content/wedding";
import { Countdown } from "@/components/Countdown";
import { CouplePhoto } from "@/components/CouplePhoto";
import { Families } from "@/components/Families";
import { RsvpForm, WishesForm } from "@/components/GuestForms";
import { LocationCard } from "@/components/LocationCard";
import { MapButton } from "@/components/MapButton";
import { MapEmbed } from "@/components/MapEmbed";
import { Monogram } from "@/components/Monogram";
import { Reveal } from "@/components/Reveal";
import { ScrollTopButton } from "@/components/ScrollTopButton";

type InvitationLetterProps = {
  onClose: () => void;
  /** When true, shell chrome is provided by Envelope’s expanding sheet */
  embedded?: boolean;
  /** Opening from the envelope — keep the top stable, no enter offset */
  fromEnvelope?: boolean;
  /** Arm scroll reveals after the envelope layout projection has settled */
  revealsReady?: boolean;
  /**
   * Mount maps/forms/etc only after the open morph settles so the first
   * open animation isn’t competing with a huge React + image decode spike.
   */
  mountBody?: boolean;
};

export function InvitationLetter({
  onClose,
  embedded = false,
  fromEnvelope = false,
  revealsReady = true,
  mountBody = true,
}: InvitationLetterProps) {
  return (
    <div
      className={
        embedded
          ? "relative w-full overflow-x-clip"
          : "relative mx-auto min-h-dvh w-full max-w-xl overflow-x-clip bg-surface md:my-10 md:min-h-0 md:rounded-2xl md:shadow-[0_20px_60px_rgb(23_20_18/0.1)] md:ring-1 md:ring-black/5"
      }
    >
      <div className="letter-surface relative pb-16 text-ink">
        <div className="flex items-center justify-between px-5 pt-5 sm:px-8">
          <Monogram size={48} />
          <button
            type="button"
            onClick={onClose}
            className="font-ui min-h-10 touch-manipulation px-2 text-xs tracking-[0.16em] text-ink-soft uppercase transition hover:text-ink"
          >
            {wedding.closeEnvelope}
          </button>
        </div>

        {/* Brand-first hero — names lead before imagery */}
        <Reveal
          immediate={fromEnvelope}
          className="relative px-5 pb-10 pt-10 text-center sm:px-10 sm:pb-12 sm:pt-14"
        >
          <p className="font-ui text-[0.7rem] tracking-[0.28em] text-accent uppercase">
            Πρόσκληση γάμου
          </p>
          <h1 className="mt-4 font-script text-[2.75rem] leading-[1.12] text-ink sm:text-6xl">
            {wedding.namesJoined}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-soft sm:text-xl">
            {wedding.heroLine}
          </p>
          <p className="mt-6 text-2xl tracking-wide text-ink sm:text-3xl">
            {wedding.dateDisplay}
          </p>
        </Reveal>

        {/* Portrait outside Reveal so parent transforms don't kill parallax */}
        <CouplePhoto />

        {mountBody ? (
          <div className="[content-visibility:auto] [contain-intrinsic-size:1px_2400px]">
            <Reveal enabled={revealsReady}>
              <section className="border-y border-[var(--line)] bg-surface-soft/80 px-4 py-10 sm:px-10">
                <p className="font-ui mb-6 text-center text-[0.7rem] tracking-[0.24em] text-accent uppercase">
                  Αντίστροφη μέτρηση
                </p>
                <Countdown />
                <p className="mt-6 text-center text-lg text-ink">
                  {wedding.dateShort}
                </p>
              </section>
            </Reveal>

            <Reveal enabled={revealsReady}>
              <LocationCard
                title={wedding.ceremony.title}
                subtitle={wedding.ceremony.subtitle}
                place={wedding.ceremony.place}
                detail={wedding.ceremony.detail}
                photo={wedding.ceremony.photo}
                photoAspect="aspect-[4/5] sm:aspect-[5/4]"
                photoPosition="center 18%"
                mapImage={wedding.ceremony.mapImage}
                mapsUrl={wedding.ceremony.mapsUrl}
                iconSrc="/icons/church.svg"
              />
            </Reveal>

            <div className="divider" />

            <Reveal enabled={revealsReady}>
              <LocationCard
                title={wedding.reception.title}
                subtitle={wedding.reception.subtitle}
                place={wedding.reception.place}
                detail={wedding.reception.detail}
                photo={wedding.reception.photo}
                photoAspect="aspect-[5/3]"
                mapImage={wedding.reception.mapImage}
                mapsUrl={wedding.reception.mapsUrl}
                iconSrc="/icons/venue.svg"
              />
            </Reveal>

            <div className="divider" />

            <Reveal enabled={revealsReady}>
              <Families />
            </Reveal>

            <div className="divider" />

            <Reveal enabled={revealsReady}>
              <section className="px-5 py-12 sm:px-10 sm:py-14">
                <h2 className="text-center text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
                  {wedding.prep.title}
                </h2>
                <div className="mt-10 space-y-12">
                  <PrepBlock
                    title={wedding.prep.groom.title}
                    blurb={wedding.prep.groom.blurb}
                    address={wedding.prep.groom.address}
                    mapImage={wedding.prep.groom.mapImage}
                    mapsUrl={wedding.prep.groom.mapsUrl}
                  />
                  <PrepBlock
                    title={wedding.prep.bride.title}
                    blurb={wedding.prep.bride.blurb}
                    address={wedding.prep.bride.address}
                    mapImage={wedding.prep.bride.mapImage}
                    mapsUrl={wedding.prep.bride.mapsUrl}
                  />
                </div>
              </section>
            </Reveal>

            <div className="divider" />

            <Reveal enabled={revealsReady}>
              <RsvpForm />
            </Reveal>

            <div className="divider" />

            <Reveal enabled={revealsReady}>
              <WishesForm />
            </Reveal>

            <footer className="px-6 pb-8 pt-6 text-center">
              <p className="font-script text-3xl text-ink">
                {wedding.namesJoined}
              </p>
              <p className="font-ui mt-2 text-sm tracking-[0.18em] text-ink-soft">
                {wedding.dateDisplay}
              </p>
              <p className="font-ui mt-5 text-[0.7rem] tracking-wide text-ink-soft/80">
                <a
                  href={wedding.music.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[var(--line)] underline-offset-4 transition hover:text-accent"
                >
                  {wedding.music.creditLabel}
                </a>
              </p>

              <a
                href={wedding.maker.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${wedding.maker.line} — ${wedding.maker.instagramLabel}`}
                className="font-ui mt-10 flex flex-col items-center gap-3 border-t border-[var(--line)] px-2 pb-2 pt-8 text-ink-soft/80 transition hover:text-accent"
              >
                <span className="text-center text-[0.75rem] tracking-wide">
                  {wedding.maker.line}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] transition hover:border-accent">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <rect
                      x="3.5"
                      y="3.5"
                      width="17"
                      height="17"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
                  </svg>
                </span>
              </a>
            </footer>
          </div>
        ) : null}
      </div>

      {mountBody ? <ScrollTopButton /> : null}
    </div>
  );
}

function PrepBlock({
  title,
  blurb,
  address,
  mapImage,
  mapsUrl,
}: {
  title: string;
  blurb: string;
  address: string;
  mapImage: string;
  mapsUrl: string;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h3 className="text-2xl text-ink sm:text-3xl">{title}</h3>
      <p className="mt-3 text-base text-ink-soft">{blurb}</p>
      <p className="mt-3 text-lg text-ink">{address}</p>
      <div className="mt-6">
        <MapEmbed title={title} imageSrc={mapImage} className="h-48 sm:h-56" />
      </div>
      <MapButton href={mapsUrl} label={wedding.mapLabel} />
    </div>
  );
}
