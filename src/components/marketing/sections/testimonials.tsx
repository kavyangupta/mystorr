import { Reveal } from "@/components/marketing/reveal";
import { TESTIMONIALS } from "@/lib/marketing-content";

export function Testimonials() {
  return (
    <section className="bg-[#FFFBF5] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            Loved by sellers
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Real shops, real orders, less stress
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.11}>
              <figure className="card-lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-100 bg-[#FFFBF0] p-6">
                {/* large decorative quote mark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-3 select-none font-serif text-[88px] leading-none text-brand/15"
                >
                  &rdquo;
                </span>
                <span className="relative text-3xl">{t.emoji}</span>
                <blockquote className="relative mt-4 flex-1 text-sm leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="relative mt-5">
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.location}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
