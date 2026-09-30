"use client";

import { motion } from "framer-motion";
import { wedding } from "@/content/wedding";
import { Countdown } from "@/components/Countdown";
import { CouplePhoto } from "@/components/CouplePhoto";
import { Families } from "@/components/Families";
import { LocationCard } from "@/components/LocationCard";
import { WaxSeal } from "@/components/WaxSeal";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function InvitationLetter() {
  return (
    <motion.div
      className="relative mx-auto min-h-dvh w-full max-w-xl overflow-x-hidden md:my-6 md:shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top forest flap remnant */}
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
        {/* Hero */}
        <motion.section
          className="chevron-bottom relative px-4 pb-16 pt-14 text-center sm:px-10 sm:pb-20 sm:pt-16"
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
          <p className="mt-5 font-serif text-lg text-ink-soft sm:text-xl">
            {wedding.heroLine}
          </p>
          <p className="mt-6 font-serif text-2xl tracking-wide text-ink sm:text-3xl">
            {wedding.dateDisplay}
          </p>

          <CouplePhoto />
        </motion.section>

        {/* Countdown band */}
        <section className="border-y border-gold/25 bg-cream-warm/60 px-3 py-10 sm:px-10">
          <p className="mb-6 text-center text-xs tracking-[0.24em] text-gold-dark uppercase">
            Αντίστροφη μέτρηση
          </p>
          <Countdown />
          <p className="mt-6 text-center font-serif text-lg text-ink">
            {wedding.dateShort}
          </p>
        </section>

        <Families />

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <LocationCard
          title={wedding.ceremony.title}
          subtitle={wedding.ceremony.subtitle}
          place={wedding.ceremony.place}
          detail={wedding.ceremony.city}
          embedUrl={wedding.ceremony.embedUrl}
          mapsUrl={wedding.ceremony.mapsUrl}
          iconSrc="/icons/church.svg"
          iconAlt=""
        />

        <div className="mx-auto h-px w-24 bg-gold/50" />

        {/* Prep */}
        <section className="px-4 py-12 sm:px-10 sm:py-14">
          <h2 className="text-center font-serif text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
            {wedding.prep.title}
          </h2>
          <div className="mt-10 space-y-12">
            <PrepBlock
              title={wedding.prep.bride.title}
              address={wedding.prep.bride.address}
              embedUrl={wedding.prep.bride.embedUrl}
              mapsUrl={wedding.prep.bride.mapsUrl}
            />
            <PrepBlock
              title={wedding.prep.groom.title}
              address={wedding.prep.groom.address}
              embedUrl={wedding.prep.groom.embedUrl}
              mapsUrl={wedding.prep.groom.mapsUrl}
            />
          </div>
        </section>

        <div className="mx-auto h-px w-24 bg-gold/50" />

        <LocationCard
          title={wedding.reception.title}
          subtitle={wedding.reception.subtitle}
          place={wedding.reception.place}
          detail={`${wedding.reception.address} · ${wedding.reception.city}`}
          embedUrl={wedding.reception.embedUrl}
          mapsUrl={wedding.reception.mapsUrl}
          iconSrc="/icons/venue.svg"
          iconAlt=""
        />

        <footer className="px-6 pb-10 pt-4 text-center">
          <p className="font-script text-3xl text-ink">{wedding.namesJoined}</p>
          <p className="mt-2 text-sm tracking-[0.18em] text-ink-soft">
            {wedding.dateDisplay}
          </p>
        </footer>
      </div>

      {/* Bottom flap */}
      <div
        aria-hidden
        className="relative h-20 bg-forest sm:h-24"
        style={{ clipPath: "polygon(0 45%, 50% 0, 100% 45%, 100% 100%, 0 100%)" }}
      >
        <div className="gold-border-strip absolute inset-x-0 bottom-0 h-4 opacity-80" />
      </div>
    </motion.div>
  );
}

function PrepBlock({
  title,
  address,
  embedUrl,
  mapsUrl,
}: {
  title: string;
  address: string;
  embedUrl: string;
  mapsUrl: string;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h3 className="text-xs font-medium tracking-[0.22em] text-gold-dark uppercase">
        {title}
      </h3>
      <p className="mt-3 font-serif text-xl text-ink">{address}</p>
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
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 touch-manipulation items-center border-b border-gold pb-0.5 text-sm tracking-[0.16em] text-forest uppercase transition hover:text-gold-dark"
      >
        Οδηγίες
      </a>
    </div>
  );
}
