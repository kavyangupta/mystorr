import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Get Started" },
];

const COMPANY_LINKS = [
  { href: "/login", label: "Sign in" },
  { href: "/", label: "Home" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <span className="text-xl font-extrabold tracking-tight text-brand">
              Mystorr
            </span>
            <p className="mt-3 text-sm text-muted">
              Your shop. One link. Share everywhere. Focus on what you love — we
              handle the rest.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h3 className="text-sm font-bold text-ink">Product</h3>
              <ul className="mt-3 space-y-2.5">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Company</h3>
              <ul className="mt-3 space-y-2.5">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>Made with ❤️ in India</p>
          <p>© 2025 Mystorr</p>
        </div>
      </div>
    </footer>
  );
}
