import { Reveal } from "@/components/marketing/reveal";
import { AUDIENCE } from "@/lib/marketing-content";

export function WhoItsFor() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            Who it&apos;s for
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Made for makers, cooks and creators
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 90}>
              <div className="card-lift h-full rounded-2xl border border-line bg-white p-6 text-center">
                <span className="text-4xl">{a.emoji}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
