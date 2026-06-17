import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { LanguageProvider } from "@/components/marketing/lang-context";
import { Hero } from "@/components/marketing/sections/hero";
import { PainPoints } from "@/components/marketing/sections/pain-points";
import { Trust } from "@/components/marketing/sections/trust";
import { HowItWorks } from "@/components/marketing/sections/how-it-works";
import { Templates } from "@/components/marketing/sections/templates";
import { WhoItsFor } from "@/components/marketing/sections/who-its-for";
import { Testimonials } from "@/components/marketing/sections/testimonials";
import { FinalCta } from "@/components/marketing/sections/final-cta";

// Re-fetch the demo-store previews periodically (ISR) instead of per request.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mystorr · Your products. One link. Everywhere.",
  description:
    "Mystorr is the one beautiful shop link for Indian sellers. Customers browse everything and pay directly via UPI — organised, confirmed, tracked. Free, no app needed.",
  openGraph: {
    title: "Mystorr · Your products. One link. Everywhere.",
    description:
      "Stop explaining your products in every DM. Create a free shop link in 10 minutes. Customers browse and pay directly via UPI.",
  },
};

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <MarketingNav />
        <main>
          <Hero />
          <PainPoints />
          <Trust />
          <HowItWorks />
          <Templates />
          <WhoItsFor />
          <Testimonials />
          <FinalCta />
        </main>
        <MarketingFooter />
      </div>
    </LanguageProvider>
  );
}
