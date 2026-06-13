import { Reveal } from "@/components/marketing/reveal";
import { PAIN_POINTS } from "@/lib/marketing-content";

export function PainPoints() {
  return (
    <section className="bg-[#FFF5F5] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-red-500">
            Sound familiar?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Running a small business shouldn&apos;t feel like a second job
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <div className="card-lift h-full rounded-2xl border border-red-100 bg-white p-6">
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
