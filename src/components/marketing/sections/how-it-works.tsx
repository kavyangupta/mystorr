import { Reveal, RevealLeft } from "@/components/marketing/reveal";
import { STEPS } from "@/lib/marketing-content";

export function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            How it works
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Go from DM chaos to organised shop in 10 minutes
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <RevealLeft key={s.number} delay={i * 0.15}>
              <div className="relative text-center sm:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[#7C3AED] text-2xl font-extrabold text-white shadow-lg shadow-brand/20 sm:mx-0">
                  {s.number}
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </RevealLeft>
          ))}
        </div>
      </div>
    </section>
  );
}
