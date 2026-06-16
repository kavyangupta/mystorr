import Link from "next/link";
import { MystorrLogo } from "@/components/marketing/logo";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/login", label: "Create free shop" },
];

const COMPANY_LINKS = [
  { href: "/login", label: "Sign in" },
  { href: "/", label: "Home" },
];

export function MarketingFooter() {
  return (
    <footer className="bg-[#18181B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <MystorrLogo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Mystorr — Your shop. One link. Everywhere. Customers browse and pay
              directly via UPI. No more DM chaos.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h3 className="text-sm font-bold text-white">Product</h3>
              <ul className="mt-3 space-y-2.5">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/60 transition-colors hover:text-[#F97316]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Company</h3>
              <ul className="mt-3 space-y-2.5">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/60 transition-colors hover:text-[#F97316]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>Made with ❤️ in India · Free for Indian sellers</p>
          <p>© 2025 Mystorr</p>
        </div>
      </div>
    </footer>
  );
}
