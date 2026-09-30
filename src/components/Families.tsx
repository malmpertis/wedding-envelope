import { wedding } from "@/content/wedding";

export function Families() {
  return (
    <>
      <section className="px-5 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-lg text-center">
          <img
            src="/icons/rings.svg"
            alt=""
            width={64}
            height={40}
            className="mx-auto mb-6 opacity-70"
          />
          <h2 className="text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
            {wedding.families.title}
          </h2>

          <div className="mt-10">
            <h3 className="font-ui text-sm font-semibold tracking-wide text-ink">
              {wedding.families.groomSide.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {wedding.families.groomSide.members.map((name) => (
                <li key={name} className="text-lg text-ink-soft sm:text-xl">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-ink-soft sm:text-base">
            {wedding.families.footnote}
          </p>
        </div>
      </section>

      <div className="divider" />

      <section className="px-5 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-[1.85rem] font-semibold tracking-wide text-ink sm:text-4xl">
            {wedding.families.koumparoi.title}
          </h2>
          <ul className="mt-6 space-y-2">
            {wedding.families.koumparoi.members.map((name) => (
              <li key={name} className="text-lg text-ink sm:text-xl">
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-ink-soft sm:text-base">
            {wedding.families.koumparoi.footnote}
          </p>
        </div>
      </section>
    </>
  );
}
