import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#534AB7] via-[#6D4BC9] to-[#7C3AED] px-6 py-16 text-center gradient-pan">
        {/* subtle rangoli-inspired pattern */}
        <div
          aria-hidden
          className="bg-rangoli pointer-events-none absolute inset-0 opacity-[0.12]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl animate-float"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-[#9F7AEA]/30 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to get your first order?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/85">
            Set up your free shop in ten minutes and start sharing your link today.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "default" }),
              "btn-glow mt-8 bg-white px-8 text-base text-brand hover:bg-white"
            )}
          >
            Create your free shop →
          </Link>
          <p className="mt-4 text-sm text-white/75">
            ✓ Free forever&nbsp;&nbsp; ✓ No credit card needed
          </p>
        </div>
      </div>
    </section>
  );
}
