import { Reveal, RevealPop } from "@/components/marketing/reveal";
import { TRUST_BADGES } from "@/lib/marketing-content";

export function Trust() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            You can trust Mystorr
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Safe, simple, and made for you
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((b, i) => (
            <RevealPop key={b.text} delay={(i % 4) * 0.1}>
              <div className="card-lift flex h-full flex-col items-center rounded-2xl border border-line bg-[#FAFAFE] p-6 text-center">
                <span className="text-4xl">{b.emoji}</span>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-ink">
                  {b.text}
                </p>
              </div>
            </RevealPop>
          ))}
        </div>
      </div>
    </section>
  );
}
