"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { LoadUp, LoadRight } from "@/components/marketing/reveal";
import { useLang } from "@/components/marketing/lang-context";
import { HERO } from "@/lib/marketing-content";

// Slowly floating product emojis in the hero backdrop.
const FLOATERS = [
  { e: "💍", className: "left-[6%] top-[18%]", delay: "0s", size: "text-4xl" },
  { e: "👗", className: "right-[8%] top-[12%]", delay: "1.2s", size: "text-5xl" },
  { e: "🏺", className: "left-[12%] bottom-[14%]", delay: "2.1s", size: "text-4xl" },
  { e: "🍛", className: "right-[14%] bottom-[18%]", delay: "0.6s", size: "text-5xl" },
];

export function Hero() {
  const { lang } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#534AB7] via-[#6D4BC9] to-[#7C3AED] gradient-pan">
      {/* floating blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#9F7AEA]/30 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      {/* floating product emojis */}
      {FLOATERS.map((f) => (
        <span
          key={f.e}
          aria-hidden
          className={cn(
            "pointer-events-none absolute select-none opacity-40 animate-float drop-shadow-lg",
            f.size,
            f.className
          )}
          style={{ animationDelay: f.delay }}
        >
          {f.e}
        </span>
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        {/* left — copy */}
        <div className="text-center lg:text-left">
          <LoadUp delay={0}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur">
              {HERO.badge}
            </span>
          </LoadUp>

          <LoadUp delay={0.1}>
            <h1 className="mt-5 text-[38px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[60px]">
              {HERO.headline[lang]}
            </h1>
          </LoadUp>

          <LoadUp delay={0.2}>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/85 lg:mx-0">
              {HERO.sub[lang]}
            </p>
          </LoadUp>

          <LoadUp delay={0.3}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:items-start lg:justify-start">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "btn-glow w-full bg-white px-6 text-base text-brand hover:bg-white sm:w-auto"
                )}
              >
                {HERO.cta[lang]}
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "w-full border border-white/30 px-6 text-base text-white hover:bg-white/10 hover:text-white sm:w-auto"
                )}
              >
                {HERO.secondaryCta[lang]}
              </Link>
            </div>
          </LoadUp>

          <LoadUp delay={0.4}>
            <p className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-medium text-white/75 lg:justify-start">
              {HERO.trust.map((t) => (
                <span key={t}>✓ {t}</span>
              ))}
            </p>
          </LoadUp>
        </div>

        {/* right — phone */}
        <LoadRight delay={0.15} className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </LoadRight>
      </div>
    </section>
  );
}
