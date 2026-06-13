import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICING_TIERS } from "@/lib/marketing-content";
import { Reveal } from "@/components/marketing/reveal";

export function PricingCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
      {PRICING_TIERS.map((tier, i) => (
        <Reveal key={tier.name} delay={i * 0.12} className="h-full">
        <div
          className={cn(
            "card-lift relative flex h-full flex-col rounded-2xl bg-white p-7",
            tier.highlight
              ? "border-2 border-brand shadow-[0_8px_30px_rgba(83,74,183,0.18)]"
              : "border border-line shadow-card"
          )}
        >
          {tier.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white">
              Most popular
            </span>
          )}

          <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-ink">{tier.price}</span>
            {tier.period && (
              <span className="text-sm font-medium text-muted">{tier.period}</span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted">{tier.tagline}</p>

          <ul className="mt-5 flex-1 space-y-3">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                <Check
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    tier.highlight ? "text-brand" : "text-whatsapp"
                  )}
                />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: tier.highlight ? "brand" : "outline" }),
              "mt-6 w-full",
              tier.highlight && "btn-glow"
            )}
          >
            {tier.cta}
          </Link>
          <p className="mt-3 text-center text-xs text-muted">{tier.note}</p>
        </div>
        </Reveal>
      ))}
    </div>
  );
}
