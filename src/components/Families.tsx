import { wedding } from "@/content/wedding";

export function Families() {
  return (
    <section className="px-4 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <img
          src="/icons/rings.svg"
          alt=""
          width={64}
          height={40}
          className="mx-auto mb-6 opacity-80"
        />
        <h2 className="font-serif text-3xl font-semibold tracking-wide text-ink sm:text-4xl">
          {wedding.families.title}
        </h2>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="text-xs font-medium tracking-[0.22em] text-gold-dark uppercase">
              {wedding.families.groomSide.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {wedding.families.groomSide.members.map((name) => (
                <li key={name} className="font-serif text-lg text-ink sm:text-xl">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto h-px w-16 bg-gold/60" />

          <div>
            <h3 className="text-xs font-medium tracking-[0.22em] text-gold-dark uppercase">
              {wedding.families.koumparoi.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {wedding.families.koumparoi.members.map((name) => (
                <li key={name} className="font-serif text-lg text-ink sm:text-xl">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
