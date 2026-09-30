"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { wedding } from "@/content/wedding";
import {
  formsConfigured,
  submitToSheet,
  type FormStatus,
} from "@/lib/forms";

function useAlive() {
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  return alive;
}

const fieldClass =
  "font-ui mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 text-base text-ink outline-none transition focus:border-accent disabled:opacity-60";

const submitButtonClass =
  "font-ui flex min-h-12 w-full touch-manipulation items-center justify-center border border-ink bg-transparent px-4 text-sm tracking-[0.14em] text-ink uppercase transition hover:bg-ink hover:text-surface disabled:pointer-events-none disabled:opacity-50";

function StatusMessage({ status }: { status: FormStatus }) {
  if (status === "submitting") {
    return (
      <p className="font-ui text-center text-sm text-ink-soft">Αποστολή…</p>
    );
  }
  if (status === "success") {
    return (
      <p className="font-ui text-center text-sm text-ink">
        Ευχαριστούμε — το μήνυμά σας καταχωρήθηκε.
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="font-ui text-center text-sm text-ink">
        {formsConfigured()
          ? "Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο."
          : "Η φόρμα δεν είναι ακόμα συνδεδεμένη με το φύλλο Google."}
      </p>
    );
  }
  return null;
}

export function RsvpForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const alive = useAlive();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const attendance = String(data.get("attendance") || "");
    const guests = String(data.get("guests") || "").trim();
    const children = String(data.get("children") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    const attendanceLabel =
      wedding.rsvp.attendanceOptions.find((o) => o.value === attendance)
        ?.label || attendance;

    setStatus("submitting");
    try {
      await submitToSheet({
        type: "rsvp",
        name,
        phone,
        attendance: attendanceLabel,
        guests,
        children,
        notes,
      });
      if (!alive.current) return;
      setStatus("success");
      form.reset();
    } catch {
      if (alive.current) setStatus("error");
    }
  };

  return (
    <section id="rsvp" className="px-5 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
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
        <label className="font-ui block text-sm font-semibold text-ink">
          Ονοματεπώνυμο
          <input
            name="name"
            required
            className={fieldClass}
            autoComplete="name"
            disabled={status === "submitting"}
          />
        </label>
        <label className="font-ui block text-sm font-semibold text-ink">
          Τηλέφωνο
          <input
            name="phone"
            type="tel"
            className={fieldClass}
            autoComplete="tel"
            disabled={status === "submitting"}
          />
        </label>
        <fieldset className="space-y-2" disabled={status === "submitting"}>
          <legend className="font-ui text-sm font-semibold text-ink">
            Θα παρευρεθείτε στη δεξίωση;
          </legend>
          {wedding.rsvp.attendanceOptions.map((opt) => (
            <label
              key={opt.value}
              className="font-ui flex min-h-11 cursor-pointer items-center gap-3 text-base text-ink"
            >
              <input
                type="radio"
                name="attendance"
                value={opt.value}
                required
                className="h-4 w-4 accent-[var(--accent)]"
              />
              {opt.label}
            </label>
          ))}
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <label className="font-ui block text-sm font-semibold text-ink">
            Άτομα
            <input
              name="guests"
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldClass}
              disabled={status === "submitting"}
            />
          </label>
          <label className="font-ui block text-sm font-semibold text-ink">
            Παιδιά (έως 6 ετών)
            <input
              name="children"
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldClass}
              disabled={status === "submitting"}
            />
          </label>
        </div>
        <label className="font-ui block text-sm font-semibold text-ink">
          Θέλετε να γνωρίζουμε κάτι:
          <textarea
            name="notes"
            rows={3}
            className={fieldClass}
            disabled={status === "submitting"}
          />
        </label>
        <button
          type="submit"
          className={submitButtonClass}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Αποστολή…" : wedding.rsvp.submit}
        </button>
        <StatusMessage status={status} />
      </form>
    </section>
  );
}

export function WishesForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const alive = useAlive();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const wish = String(data.get("wish") || "").trim();

    setStatus("submitting");
    try {
      await submitToSheet({ type: "wish", name, wish });
      if (!alive.current) return;
      setStatus("success");
      form.reset();
    } catch {
      if (alive.current) setStatus("error");
    }
  };

  return (
    <section id="wishes" className="px-5 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
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
        <label className="font-ui block text-sm font-semibold text-ink">
          Ονοματεπώνυμο
          <input
            name="name"
            required
            className={fieldClass}
            autoComplete="name"
            disabled={status === "submitting"}
          />
        </label>
        <label className="font-ui block text-sm font-semibold text-ink">
          Ευχή
          <textarea
            name="wish"
            required
            rows={4}
            className={fieldClass}
            disabled={status === "submitting"}
          />
        </label>
        <button
          type="submit"
          className={submitButtonClass}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Αποστολή…" : wedding.wishes.submit}
        </button>
        <StatusMessage status={status} />
      </form>
    </section>
  );
}
