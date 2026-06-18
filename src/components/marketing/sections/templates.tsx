import Link from "next/link";
import { Gem, Shirt, ShoppingBag, Soup, Cookie, Candy } from "lucide-react";
import { Reveal, RevealPop } from "@/components/marketing/reveal";

/**
 * "Choose your template" — four genuinely distinct cards, each shaped after the
 * kind of shop it represents. Every "Use this template" button links to
 * /login?category=X (onboarding reads the param and skips the "what do you
 * sell" step); "Preview this shop" opens the real seeded demo storefront.
 *
 * Pure marketing section — touches no storefront/dashboard/product component.
 */
export function Templates() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            Start in seconds
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Choose your template
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted">
            Preview a real shop, then make it yours. Your products, your photos —
            ready in minutes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <RevealPop className="h-full" delay={0}>
            <JewelleryCard />
          </RevealPop>
          <RevealPop className="h-full" delay={0.1}>
            <ClothingCard />
          </RevealPop>
          <RevealPop className="h-full" delay={0.2}>
            <PicklesCard />
          </RevealPop>
          <RevealPop className="h-full" delay={0.3}>
            <TiffinCard />
          </RevealPop>
        </div>
      </div>
    </section>
  );
}

/** Shared bottom actions: solid "Use this template" + "Preview this shop". */
function TemplateCta({
  category,
  slug,
  color,
}: {
  category: string;
  slug: string;
  color: string;
}) {
  return (
    <div className="mt-auto flex flex-col gap-2 pt-5">
      <Link
        href={`/login?category=${category}`}
        className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90 active:opacity-80"
        style={{ backgroundColor: color }}
      >
        Use this template
      </Link>
      <Link
        href={`/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-sm font-semibold transition hover:underline"
        style={{ color }}
      >
        Preview this shop →
      </Link>
    </div>
  );
}

/* ── Card 1 — Riya's Jewellery · spotlight badge ──────────────────────────── */
function JewelleryCard() {
  return (
    <div
      className="card-lift flex h-full flex-col items-center rounded-2xl p-6 text-center shadow-card"
      style={{ backgroundColor: "#FAEEDA" }}
    >
      <div
        className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white"
        style={{ border: "1px solid #E3C27E" }}
      >
        <Gem className="h-8 w-8" style={{ color: "#854F0B" }} />
      </div>
      <p
        className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ color: "#854F0B" }}
      >
        Spotlight
      </p>
      <h3 className="mt-1 text-lg font-extrabold text-ink">
        {"Riya's Jewellery"}
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: "#854F0B" }}>
        Jewellery &amp; accessories
      </p>
      <TemplateCta category="jewellery" slug="riyas-jewellery" color="#854F0B" />
    </div>
  );
}

/* ── Card 2 — Sana's Clothing · editorial mini-rack ───────────────────────── */
function ClothingCard() {
  return (
    <div
      className="card-lift flex h-full flex-col rounded-2xl p-6 shadow-card"
      style={{ backgroundColor: "#F1EFE8" }}
    >
      <div className="flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
          <Shirt className="h-6 w-6" style={{ color: "#534AB7" }} />
        </div>
        <div className="-ml-3 flex h-12 w-12 translate-y-1.5 items-center justify-center rounded-lg bg-white shadow-sm">
          <ShoppingBag className="h-6 w-6" style={{ color: "#534AB7" }} />
        </div>
      </div>
      <p
        className="mt-4 text-[11px] font-bold uppercase tracking-[0.25em]"
        style={{ color: "#534AB7" }}
      >
        Clothing &amp; fashion
      </p>
      <h3 className="mt-1 text-lg font-extrabold text-ink">
        {"Sana's Clothing"}
      </h3>
      <p className="mt-1 text-sm text-muted">Everyday &amp; festive wear</p>
      <TemplateCta category="clothing" slug="sanas-clothing" color="#534AB7" />
    </div>
  );
}

/* ── Card 3 — Sunita's Pickles · jars on a shelf ──────────────────────────── */
function PicklesCard() {
  return (
    <div
      className="card-lift flex h-full flex-col items-center rounded-[24px] p-6 text-center shadow-card"
      style={{ backgroundColor: "#FAECE7" }}
    >
      <div className="flex items-end">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          <Soup className="h-6 w-6" style={{ color: "#993C1D" }} />
        </div>
        <div className="-ml-3 flex h-14 w-14 -translate-y-1 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          <Cookie className="h-7 w-7" style={{ color: "#993C1D" }} />
        </div>
        <div className="-ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          <Candy className="h-6 w-6" style={{ color: "#993C1D" }} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-ink">
        {"Sunita's Pickles"}
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: "#993C1D" }}>
        Homemade products
      </p>
      <TemplateCta category="homemade" slug="sunitas-pickles" color="#993C1D" />
    </div>
  );
}

/* ── Card 4 — Meena's Tiffin · live menu preview ──────────────────────────── */
function TiffinCard() {
  return (
    <div
      className="card-lift flex h-full flex-col rounded-2xl border border-amber-200 p-5 shadow-card"
      style={{ backgroundColor: "#FFFBF5" }}
    >
      <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-ink">
            {"Today's Menu"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Open now
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Dal Rice Combo</span>
          <span className="font-bold text-ink">₹120</span>
        </div>
        <div className="my-2 h-px bg-line" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Paneer Thali</span>
          <span className="font-bold text-ink">₹150</span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-ink">
        {"Meena's Tiffin"}
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: "#F97316" }}>
        Daily menu &amp; food
      </p>
      <TemplateCta category="food" slug="meenas-tiffin" color="#F97316" />
    </div>
  );
}
