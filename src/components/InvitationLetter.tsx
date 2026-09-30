"use client";

import { motion } from "framer-motion";
import { wedding } from "@/content/wedding";
import { Countdown } from "@/components/Countdown";
import { CouplePhoto } from "@/components/CouplePhoto";
import { Families } from "@/components/Families";
import { RsvpForm, WishesForm } from "@/components/GuestForms";
import { LocationCard } from "@/components/LocationCard";
import { MapButton } from "@/components/MapButton";
import { Monogram } from "@/components/Monogram";
import { ScrollTopButton } from "@/components/ScrollTopButton";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type InvitationLetterProps = {
  onClose: () => void;
};

export function InvitationLetter({ onClose }: InvitationLetterProps) {
  return (
    <motion.div
      className="relative mx-auto min-h-dvh w-full max-w-xl overflow-x-hidden bg-surface md:my-10 md:min-h-0 md:rounded-2xl md:shadow-[0_20px_60px_rgb(23_20_18/0.1)] md:ring-1 md:ring-black/5"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="letter-surface relative pb-16 text-ink">
        <div className="flex items-center justify-between px-5 pt-5 sm:px-8">
          <Monogram size={52} />
          <button
            type="button"
            onClick={onClose}
            className="font-ui min-h-10 touch-manipulation px-2 text-xs tracking-[0.16em] text-ink-soft uppercase transition hover:text-ink"
          >
            {wedding.closeEnvelope}
          </button>
        </div>

        <motion.section
          className="relative px-5 pb-14 pt-8 text-center sm:px-10 sm:pb-16"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7, delay: 0.1 }}
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
          <CouplePhoto />
        </motion.section>

        <section className="border-y border-[var(--line)] bg-surface-soft/80 px-4 py-10 sm:px-10">
          <p className="font-ui mb-6 text-center text-[0.7rem] tracking-[0.24em] text-accent uppercase">
            Αντίστροφη μέτρηση
          </p>
          <Countdown />
          <p className="mt-6 text-center text-lg text-ink">{wedding.dateShort}</p>
        </section>

        <div className="divider my-2" />

        <LocationCard
          title={wedding.ceremony.title}
          subtitle={wedding.ceremony.subtitle}
          place={wedding.ceremony.place}
          detail={wedding.ceremony.detail}
          embedUrl={wedding.ceremony.embedUrl}
          mapsUrl={wedding.ceremony.mapsUrl}
          iconSrc="/icons/church.svg"
        />

        <div className="divider" />

        <LocationCard
          title={wedding.reception.title}
          subtitle={wedding.reception.subtitle}
          place={wedding.reception.place}
          detail={wedding.reception.detail}
          embedUrl={wedding.reception.embedUrl}
          mapsUrl={wedding.reception.mapsUrl}
          iconSrc="/icons/venue.svg"
        />

        <div className="divider" />

        <Families />

        <div className="divider" />

        <section className="px-5 py-12 sm:px-10 sm:py-14">
          <h2 className="text-center text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
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

        <div className="divider" />

        <RsvpForm />

        <div className="divider" />

        <WishesForm />

        <footer className="px-6 pb-8 pt-6 text-center">
          <p className="font-script text-3xl text-ink">{wedding.namesJoined}</p>
          <p className="font-ui mt-2 text-sm tracking-[0.18em] text-ink-soft">
            {wedding.dateDisplay}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="font-ui mt-6 min-h-11 touch-manipulation text-sm tracking-[0.16em] text-accent uppercase"
          >
            {wedding.backToEnvelope}
          </button>
        </footer>
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
      <h3 className="text-2xl text-ink sm:text-3xl">{title}</h3>
      <p className="mt-3 text-base text-ink-soft">{blurb}</p>
      <p className="mt-3 text-lg text-ink">{address}</p>
      <div className="map-frame mt-6">
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
