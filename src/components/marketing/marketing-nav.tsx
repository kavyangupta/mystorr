"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MystorrLogo } from "@/components/marketing/logo";
import { CustomerAvatars } from "@/components/marketing/customer-avatars";
import { LangToggle } from "@/components/marketing/lang-context";

const LINKS = [{ href: "/how-it-works", label: "How it works" }];

export function MarketingNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-line/70 bg-white/80 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" onClick={() => setOpen(false)} aria-label="Mystorr home">
            <MystorrLogo />
          </Link>
          <CustomerAvatars className="pl-1" />
        </div>

        {/* Center links — desktop */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right CTA + language — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <LangToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "brand", size: "sm" }), "btn-glow px-5")}
          >
            Create free shop
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-white px-6 py-8 md:hidden">
          <div className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-lg font-semibold text-ink hover:bg-background"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted">Language</span>
              <LangToggle />
            </div>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "brand" }), "mt-4 w-full")}
            >
              Create free shop
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
