import { Reveal } from "@/components/marketing/reveal";
import { FEATURES } from "@/lib/marketing-content";

export function Features() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F5F3FF] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            Everything you need
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Powerful where it counts, simple everywhere else
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="card-lift h-full rounded-2xl border border-white/60 bg-white/70 p-6 shadow-card backdrop-blur">
                <span className="text-3xl">{f.emoji}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
