"use client";

import { motion } from "framer-motion";
import { wedding } from "@/content/wedding";
import { Countdown } from "@/components/Countdown";
import { CouplePhoto } from "@/components/CouplePhoto";
import { Families } from "@/components/Families";
import { RsvpForm, WishesForm } from "@/components/GuestForms";
import { LocationCard } from "@/components/LocationCard";
import { MapButton } from "@/components/MapButton";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { WaxSeal } from "@/components/WaxSeal";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

type InvitationLetterProps = {
  onClose: () => void;
};

export function InvitationLetter({ onClose }: InvitationLetterProps) {
  return (
    <motion.div
      className="relative mx-auto min-h-dvh w-full max-w-xl overflow-x-hidden md:my-6 md:shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden
        className="relative h-24 bg-forest sm:h-28"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)" }}
      >
        <div className="gold-border-strip absolute inset-x-0 top-0 h-4 opacity-80" />
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
          <WaxSeal size={80} className="h-20 w-20" />
        </div>
      </div>

      <div className="letter-surface relative -mt-6 pb-20 text-ink shadow-[0_-8px_40px_rgba(0,0,0,0.18)]">
        <div className="flex justify-end px-4 pt-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 touch-manipulation px-3 text-xs tracking-[0.16em] text-ink-soft uppercase transition hover:text-forest"
          >
            {wedding.closeEnvelope}
          </button>
        </div>

        <motion.section
          className="chevron-bottom relative px-4 pb-16 pt-8 text-center sm:px-10 sm:pb-20"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-xs tracking-[0.28em] text-gold-dark uppercase">
            Πρόσκληση γάμου
          </p>
          <h1 className="mt-4 font-script text-[2.6rem] leading-[1.15] text-ink sm:text-6xl">
            {wedding.namesJoined}
          </h1>
          <p className="mx-auto mt-5 max-w-md font-serif text-lg leading-relaxed text-ink-soft sm:text-xl">
            {wedding.heroLine}
          </p>
          <p className="mt-6 font-serif text-2xl tracking-wide text-ink sm:text-3xl">
            {wedding.dateDisplay}
          </p>
          <CouplePhoto />
        </motion.section>

        <section className="border-y border-gold/25 bg-cream-warm/60 px-3 py-10 sm:px-10">
          <p className="mb-6 text-center text-xs tracking-[0.24em] text-gold-dark uppercase">
            Αντίστροφη μέτρηση
          </p>
          <Countdown />
          <p className="mt-6 text-center font-serif text-lg text-ink">
            {wedding.dateShort}
          </p>
        </section>

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <LocationCard
          title={wedding.ceremony.title}
          subtitle={wedding.ceremony.subtitle}
          place={wedding.ceremony.place}
          detail={wedding.ceremony.detail}
          embedUrl={wedding.ceremony.embedUrl}
          mapsUrl={wedding.ceremony.mapsUrl}
          iconSrc="/icons/church.svg"
        />

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <LocationCard
          title={wedding.reception.title}
          subtitle={wedding.reception.subtitle}
          place={wedding.reception.place}
          detail={wedding.reception.detail}
          embedUrl={wedding.reception.embedUrl}
          mapsUrl={wedding.reception.mapsUrl}
          iconSrc="/icons/venue.svg"
        />

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <Families />

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <section className="px-4 py-12 sm:px-10 sm:py-14">
          <h2 className="text-center font-serif text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
            {wedding.prep.title}
          </h2>
          <div className="mt-10 space-y-12">
            <PrepBlock
              title={wedding.prep.groom.title}
              blurb={wedding.prep.groom.blurb}
              address={wedding.prep.groom.address}
              embedUrl={wedding.prep.groom.embedUrl}
              mapsUrl={wedding.prep.groom.mapsUrl}
            />
            <PrepBlock
              title={wedding.prep.bride.title}
              blurb={wedding.prep.bride.blurb}
              address={wedding.prep.bride.address}
              embedUrl={wedding.prep.bride.embedUrl}
              mapsUrl={wedding.prep.bride.mapsUrl}
            />
          </div>
        </section>

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <RsvpForm />

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <WishesForm />

        <footer className="px-6 pb-10 pt-4 text-center">
          <p className="font-script text-3xl text-ink">{wedding.namesJoined}</p>
          <p className="mt-2 text-sm tracking-[0.18em] text-ink-soft">
            {wedding.dateDisplay}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 min-h-11 touch-manipulation text-sm tracking-[0.16em] text-forest uppercase"
          >
            {wedding.backToEnvelope}
          </button>
        </footer>
      </div>

      <div
        aria-hidden
        className="relative h-20 bg-forest sm:h-24"
        style={{
          clipPath: "polygon(0 45%, 50% 0, 100% 45%, 100% 100%, 0 100%)",
        }}
      >
        <div className="gold-border-strip absolute inset-x-0 bottom-0 h-4 opacity-80" />
      </div>

      <ScrollTopButton />
    </motion.div>
  );
}

function PrepBlock({
  title,
  blurb,
  address,
  embedUrl,
  mapsUrl,
}: {
  title: string;
  blurb: string;
  address: string;
  embedUrl: string;
  mapsUrl: string;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h3 className="font-serif text-2xl text-ink sm:text-3xl">{title}</h3>
      <p className="mt-3 text-base text-ink-soft">{blurb}</p>
      <p className="mt-3 font-serif text-lg text-ink">{address}</p>
      <div className="map-frame mt-6 overflow-hidden rounded-sm">
        <iframe
          title={title}
          src={embedUrl}
          className="h-48 w-full border-0 sm:h-56"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <MapButton href={mapsUrl} label={wedding.mapLabel} />
    </div>
  );
}
