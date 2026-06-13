import Link from "next/link";
import { Store, IndianRupee, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-app items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-brand">
            {APP_NAME}
          </span>
          <Link href="/login">
            <Button variant="brand" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-app px-4">
        {/* Hero */}
        <section className="pb-10 pt-12 text-center">
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            Made for India 🇮🇳
          </span>
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight text-ink">
            Your shop. One link.{" "}
            <span className="text-brand">Share everywhere.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            For home sellers, food makers, and Instagram businesses across
            India. Free to start.
          </p>
          <Link href="/login" className="mt-7 block">
            <Button variant="brand" className="w-full text-base">
              Create your shop
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-3 text-xs text-muted">
            Ready in 10 minutes. No app to download.
          </p>
        </section>

        {/* Features */}
        <section className="space-y-3 pb-12">
          <FeatureCard
            icon={<Store className="h-5 w-5" />}
            title="Beautiful product catalogue"
            body="Showcase your products on a clean, premium page you'll be proud to share."
          />
          <FeatureCard
            icon={<IndianRupee className="h-5 w-5" />}
            title="UPI payments built in"
            body="Customers pay you directly over UPI or order on WhatsApp in one tap."
          />
          <FeatureCard
            icon={<UtensilsCrossed className="h-5 w-5" />}
            title="Daily menu for home chefs"
            body="Update today's menu and quantities every morning. Perfect for tiffins."
          />
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center">
        <p className="text-sm text-muted">Made with ❤️ in India</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-card bg-card p-4 shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </div>
      <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
