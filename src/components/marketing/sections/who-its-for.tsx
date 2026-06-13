import { Reveal, RevealPop } from "@/components/marketing/reveal";
import { AUDIENCE } from "@/lib/marketing-content";

// Colourful gradient backgrounds, one per audience card.
const CARD_BG = [
  "bg-gradient-to-br from-orange-100 to-amber-200 border-orange-200", // home chefs
  "bg-gradient-to-br from-purple-100 to-violet-200 border-purple-200", // jewellery
  "bg-gradient-to-br from-pink-100 to-rose-200 border-pink-200", // clothing
  "bg-gradient-to-br from-green-100 to-emerald-200 border-green-200", // homemade
];

export function WhoItsFor() {
  return (
    <section className="bg-[#F5F3FF] py-20 sm:py-24">
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
            <RevealPop key={a.title} delay={i * 0.1}>
              <div
                className={`card-lift h-full rounded-2xl border p-6 text-center ${
                  CARD_BG[i % CARD_BG.length]
                }`}
              >
                <span className="text-4xl">{a.emoji}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{a.body}</p>
              </div>
            </RevealPop>
          ))}
        </div>
      </div>
    </section>
  );
}
