import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { LanguageProvider } from "@/components/marketing/lang-context";
import { Reveal } from "@/components/marketing/reveal";
import { FinalCta } from "@/components/marketing/sections/final-cta";
import { STEPS, FEATURES } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "How it works · Mystorr",
  description:
    "See how Mystorr works — create your shop, add products, and share one link. Customers browse everything and pay directly via UPI in minutes.",
};

export default function HowItWorksPage() {
  return (
    <LanguageProvider>
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main>
        {/* Header */}
        <section className="bg-gradient-to-br from-[#534AB7] via-[#6D4BC9] to-[#7C3AED] px-4 py-20 text-center gradient-pan sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              How Mystorr works
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
              No code, no app, no fuss. Go from idea to a shareable shop link in
              about ten minutes.
            </p>
          </div>
        </section>

        {/* Steps — detailed */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
            {STEPS.map((s) => (
              <Reveal key={s.number}>
                <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[#7C3AED] text-2xl font-extrabold text-white shadow-lg shadow-brand/20">
                    {s.number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{s.title}</h2>
                    <p className="mt-2 text-base font-medium text-ink/80">{s.body}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {s.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Features recap */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                What you get
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 0.1}>
                  <div className="card-lift h-full rounded-2xl border border-line bg-white p-6 shadow-card">
                    <span className="text-3xl">{f.emoji}</span>
                    <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "brand" }), "btn-glow px-8")}
              >
                Create your free shop →
              </Link>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
    </LanguageProvider>
  );
}
