import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Reveal } from "@/components/marketing/reveal";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/sections/final-cta";

export const metadata: Metadata = {
  title: "Pricing · Mystorr",
  description:
    "Mystorr is free forever for up to 8 products. Go Pro at ₹299/month for unlimited products. No credit card needed, cancel anytime.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main>
        {/* Header */}
        <section className="bg-gradient-to-br from-[#534AB7] via-[#6D4BC9] to-[#7C3AED] px-4 py-20 text-center gradient-pan sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Simple, honest pricing
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
              Start free and upgrade only when you outgrow it. No commission on your
              sales, ever.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <PricingCards />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Pricing questions
              </h2>
            </Reveal>
            <div className="mt-12">
              <Reveal>
                <Faq />
              </Reveal>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
