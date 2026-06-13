import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Reveal } from "@/components/marketing/reveal";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Faq } from "@/components/marketing/faq";
import { Hero } from "@/components/marketing/sections/hero";
import { PainPoints } from "@/components/marketing/sections/pain-points";
import { HowItWorks } from "@/components/marketing/sections/how-it-works";
import { WhoItsFor } from "@/components/marketing/sections/who-its-for";
import { Features } from "@/components/marketing/sections/features";
import { Testimonials } from "@/components/marketing/sections/testimonials";
import { FinalCta } from "@/components/marketing/sections/final-cta";

export const metadata: Metadata = {
  title: "Mystorr · Your shop. One link. Share everywhere.",
  description:
    "Mystorr turns your products into one beautiful shop link. Take WhatsApp orders, accept UPI payments, and run a daily menu — free, no app needed. Built for Indian sellers.",
  openGraph: {
    title: "Mystorr · Your shop. One link. Share everywhere.",
    description:
      "Stop losing orders in DMs. Create a free shop link, take WhatsApp orders and accept UPI payments in 10 minutes.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main>
        <Hero />
        <PainPoints />
        <HowItWorks />
        <WhoItsFor />
        <Features />
        <Testimonials />

        {/* Pricing */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-brand">
                Pricing
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Start free. Upgrade only when you grow.
              </h2>
            </Reveal>
            <div className="mt-12">
              <Reveal>
                <PricingCards />
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-brand">
                FAQ
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Questions, answered
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
