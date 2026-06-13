import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { LoadUp, LoadRight } from "@/components/marketing/reveal";

export function Hero() {
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        {/* left — copy */}
        <div className="text-center lg:text-left">
          <LoadUp delay={0}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur">
              🇮🇳 Built for Indian sellers
            </span>
          </LoadUp>

          <LoadUp delay={0.1}>
            <h1 className="mt-5 text-[40px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[64px]">
              Stop losing orders in DMs.
            </h1>
          </LoadUp>

          <LoadUp delay={0.2}>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/85 lg:mx-0">
              Mystorr turns your products into one beautiful shop link. Focus on
              what you love — we handle the orders, payments and chaos.
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
                Create your free shop →
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "w-full border border-white/30 px-6 text-base text-white hover:bg-white/10 hover:text-white sm:w-auto"
                )}
              >
                See how it works
              </Link>
            </div>
          </LoadUp>

          <LoadUp delay={0.4}>
            <p className="mt-6 text-sm font-medium text-white/75">
              ✓ Free forever&nbsp;&nbsp; ✓ No app needed&nbsp;&nbsp; ✓ Setup in 10
              minutes
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
