"use client";

import { FormEvent, useState } from "react";
import { wedding } from "@/content/wedding";

function openMailto(subject: string, body: string) {
  const email = wedding.contactEmail.trim();
  const url = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

const fieldClass =
  "mt-2 w-full border border-ink/15 bg-white px-3 py-3 text-base text-ink outline-none transition focus:border-gold";

export function RsvpForm() {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const attendance = String(data.get("attendance") || "");
    const guests = String(data.get("guests") || "").trim();
    const children = String(data.get("children") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    const attendanceLabel =
      wedding.rsvp.attendanceOptions.find((o) => o.value === attendance)
        ?.label || attendance;

    const body = [
      `Ονοματεπώνυμο: ${name}`,
      `Τηλέφωνο: ${phone}`,
      `Παρουσία: ${attendanceLabel}`,
      `Άτομα: ${guests}`,
      `Παιδιά (έως 6 ετών): ${children}`,
      notes ? `Σημειώσεις: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    openMailto(`RSVP — ${name || wedding.namesJoined}`, body);
    setStatus("ready");
  };

  return (
    <section id="rsvp" className="px-4 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="font-serif text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
          {wedding.rsvp.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          {wedding.rsvp.intro}
        </p>
        {wedding.rsvp.deadlineNote ? (
          <p className="mt-3 text-sm text-ink">{wedding.rsvp.deadlineNote}</p>
        ) : null}
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 max-w-lg space-y-5 text-left"
      >
        <label className="block text-sm font-semibold text-ink">
          Ονοματεπώνυμο
          <input name="name" required className={fieldClass} autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Τηλέφωνο
          <input
            name="phone"
            type="tel"
            className={fieldClass}
            autoComplete="tel"
          />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-ink">
            Θα παρευρεθείτε στη δεξίωση;
          </legend>
          {wedding.rsvp.attendanceOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex min-h-11 cursor-pointer items-center gap-3 text-base text-ink"
            >
              <input
                type="radio"
                name="attendance"
                value={opt.value}
                required
                className="h-4 w-4 accent-[var(--forest)]"
              />
              {opt.label}
            </label>
          ))}
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-ink">
            Άτομα
            <input
              name="guests"
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Παιδιά (έως 6 ετών)
            <input
              name="children"
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldClass}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold text-ink">
          Θέλετε να γνωρίζουμε κάτι:
          <textarea name="notes" rows={3} className={fieldClass} />
        </label>
        <button
          type="submit"
          className="flex min-h-12 w-full touch-manipulation items-center justify-center bg-forest px-4 text-sm tracking-[0.14em] text-cream uppercase transition hover:bg-forest-mid"
        >
          {wedding.rsvp.submit}
        </button>
        {status === "ready" ? (
          <p className="text-center text-sm text-ink-soft">
            Ανοίγει η εφαρμογή email σας για αποστολή.
          </p>
        ) : null}
      </form>
    </section>
  );
}

export function WishesForm() {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const wish = String(data.get("wish") || "").trim();
    openMailto(
      `Ευχή — ${name || wedding.namesJoined}`,
      `Ονοματεπώνυμο: ${name}\n\nΕυχή:\n${wish}`,
    );
    setStatus("ready");
  };

  return (
    <section id="wishes" className="px-4 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="font-serif text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
          {wedding.wishes.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          {wedding.wishes.intro}
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 max-w-lg space-y-5 text-left"
      >
        <label className="block text-sm font-semibold text-ink">
          Ονοματεπώνυμο
          <input name="name" required className={fieldClass} autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Ευχή
          <textarea name="wish" required rows={4} className={fieldClass} />
        </label>
        <button
          type="submit"
          className="flex min-h-12 w-full touch-manipulation items-center justify-center border border-forest bg-transparent px-4 text-sm tracking-[0.14em] text-forest uppercase transition hover:bg-forest hover:text-cream"
        >
          {wedding.wishes.submit}
        </button>
        {status === "ready" ? (
          <p className="text-center text-sm text-ink-soft">
            Ανοίγει η εφαρμογή email σας για αποστολή.
          </p>
        ) : null}
      </form>
    </section>
  );
}
