import Link from "next/link";

// Viral growth banner shown at the very top of every public storefront.
// Every customer who visits any seller's shop sees this invitation.
export function StoreGrowthBanner() {
  return (
    <Link
      href="/"
      className="block bg-gradient-to-r from-brand to-[#7C3AED] px-4 py-2 text-center text-[12px] font-semibold text-white transition-opacity hover:opacity-95"
    >
      <span className="opacity-90">Shop on Mystorr</span>
      <span className="mx-1.5 opacity-50">·</span>
      Create your free shop at{" "}
      <span className="font-bold underline underline-offset-2">mystorr.vercel.app</span>
    </Link>
  );
}

// Prominent "Made with Mystorr" footer — slightly larger with a subtle
// purple glow so it catches the eye and drives the viral loop.
export function StoreFooter() {
  return (
    <footer className="mt-8 pb-6 pt-2 text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-bold text-brand shadow-[0_0_22px_rgba(83,74,183,0.28)] transition-shadow hover:shadow-[0_0_28px_rgba(83,74,183,0.42)]"
      >
        Made with Mystorr <span aria-hidden>⚡</span>
      </Link>
      <p className="mt-2 text-[11px] text-muted">
        Your shop. One link. Everywhere.
      </p>
    </footer>
  );
}
