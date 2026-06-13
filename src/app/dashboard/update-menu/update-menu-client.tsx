"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ImageIcon,
  PartyPopper,
  Copy,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { WhatsAppIcon } from "@/components/icons";
import { useToast } from "@/components/ui/toast";
import {
  formatPrice,
  todayLabel,
  cn,
  appUrl,
  appHost,
  CATEGORY_META,
  DAY_NAMES,
  countdownLabel,
} from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

interface SpecialRow {
  checked: boolean;
  soldOut: boolean;
  quantity: string; // empty = unlimited
}

export default function UpdateMenuClient({
  store,
  products,
}: {
  store: Store;
  products: Product[];
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const toast = useToast();
  const today = new Date().getDay();

  const specials = products.filter((p) => p.category === "todays_special");
  const always = products.filter((p) => p.category === "always_available");
  const weekly = products.filter((p) => p.category === "weekly_special");
  const festival = products.filter((p) => p.category === "festival_special");
  const preorder = products.filter((p) => p.category === "preorder");

  // Today's Special daily picker state
  const [rows, setRows] = React.useState<Record<string, SpecialRow>>(() => {
    const init: Record<string, SpecialRow> = {};
    for (const p of specials) {
      init[p.id] = {
        checked: p.is_todays_special,
        soldOut: p.quantity_available === 0,
        quantity:
          p.quantity_available > 0 ? String(p.quantity_available) : "",
      };
    }
    return init;
  });

  // Availability state for non-daily categories
  const [avail, setAvail] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const p of [...always, ...weekly, ...festival, ...preorder]) {
      init[p.id] = p.is_available;
    }
    return init;
  });

  const [saving, setSaving] = React.useState(false);
  const [published, setPublished] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const storeUrl = `${appUrl()}/${store.store_name}`;
  const storeUrlLabel = `${appHost()}/${store.store_name}`;

  const liveCount =
    Object.values(rows).filter((r) => r.checked && !r.soldOut).length +
    Object.entries(avail).filter(([, v]) => v).length;

  function toggleChecked(id: string) {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked },
    }));
  }

  function toggleSoldOut(id: string) {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], soldOut: !prev[id].soldOut },
    }));
  }

  function setQty(id: string, value: string) {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: value.replace(/\D/g, "") },
    }));
  }

  async function publish() {
    setSaving(true);
    try {
      await Promise.all([
        ...specials.map((p) => {
          const row = rows[p.id];
          let qty = -1;
          if (row.soldOut) qty = 0;
          else if (row.quantity !== "") qty = parseInt(row.quantity, 10);
          return supabase
            .from("products")
            .update({
              is_todays_special: row.checked,
              is_available: true,
              quantity_available: qty,
            })
            .eq("id", p.id);
        }),
        ...[...always, ...weekly, ...festival, ...preorder].map((p) =>
          supabase
            .from("products")
            .update({ is_available: avail[p.id] })
            .eq("id", p.id)
        ),
      ]);
      setPublished(true);
      router.refresh();
    } catch {
      toast("Could not publish menu", "error");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy link", "error");
    }
  }

  function shareWhatsApp() {
    const text = `Today's menu is live! 🍱\nOrder here: ${storeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  // ----- Success screen ----------------------------------------------------
  if (published) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-whatsapp/10">
          <PartyPopper className="h-10 w-10 text-whatsapp" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-ink">
          Your menu is live! 🎉
        </h1>
        <p className="mt-2 text-sm text-muted">
          {liveCount} {liveCount === 1 ? "dish" : "dishes"} available today.
          Share your link so customers can order.
        </p>

        <button
          onClick={copyLink}
          className="mt-6 flex w-full max-w-xs items-center justify-between gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink"
        >
          <span className="truncate">{storeUrlLabel}</span>
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-whatsapp" />
          ) : (
            <Copy className="h-4 w-4 shrink-0 text-muted" />
          )}
        </button>

        <Button
          variant="whatsapp"
          className="mt-3 w-full max-w-xs"
          onClick={shareWhatsApp}
        >
          <WhatsAppIcon className="h-4 w-4" /> Share on WhatsApp
        </Button>

        <a
          href={`/${store.store_name}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 w-full max-w-xs"
        >
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4" /> View my menu
          </Button>
        </a>

        <Link
          href="/dashboard"
          className="mt-5 text-sm font-medium text-muted hover:text-ink"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  // ----- Editor ------------------------------------------------------------
  const hasAnything = products.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <nav className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-app items-center gap-2 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="ml-1 text-base font-bold text-ink">
            Today&apos;s Menu
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-app px-4 py-4">
        <div className="rounded-xl bg-gradient-to-b from-white to-[#F5F3FF] p-4 shadow-card">
          <p className="text-lg font-extrabold text-ink">Good morning! 🍳</p>
          <p className="mt-0.5 text-sm text-muted">{todayLabel()}</p>
          <p className="mt-1 text-xs text-muted">
            Pick what you&apos;re cooking today, then publish.
          </p>
        </div>

        {!hasAnything ? (
          <div className="mt-6 rounded-xl border border-dashed border-line py-10 text-center">
            <p className="text-sm text-muted">No dishes yet</p>
            <Link href="/dashboard" className="mt-3 inline-block">
              <Button size="sm">Add dishes first</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {/* Today's Special — the daily decision */}
            {specials.length > 0 && (
              <section>
                <SectionHeading category="todays_special" />
                <div className="space-y-2.5">
                  {specials.map((p) => {
                    const row = rows[p.id];
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          "rounded-lg border bg-white p-3 transition-colors",
                          row.checked && !row.soldOut
                            ? "border-brand"
                            : "border-line"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleChecked(p.id)}
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                              row.checked
                                ? "border-brand bg-brand text-white"
                                : "border-line bg-white"
                            )}
                            aria-label="Cooking today"
                          >
                            {row.checked && <Check className="h-4 w-4" />}
                          </button>

                          <Thumb product={p} />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">
                              {p.name}
                            </p>
                            <p className="text-xs text-muted">
                              {formatPrice(p.price)}
                            </p>
                          </div>
                        </div>

                        {row.checked && (
                          <div className="mt-3 space-y-2 pl-9">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted">
                                Qty today
                              </span>
                              <Input
                                inputMode="numeric"
                                value={row.quantity}
                                placeholder="Unlimited"
                                disabled={row.soldOut}
                                onChange={(e) => setQty(p.id, e.target.value)}
                                className="h-9 w-28"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted">
                                Mark sold out
                              </span>
                              <Toggle
                                checked={row.soldOut}
                                onChange={() => toggleSoldOut(p.id)}
                                activeColor="bg-red-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Weekly Special — auto-highlight today's day */}
            {weekly.length > 0 && (
              <section>
                <SectionHeading category="weekly_special" />
                <div className="space-y-2.5">
                  {weekly.map((p) => {
                    const isToday = p.weekly_day === today;
                    return (
                      <AvailRow
                        key={p.id}
                        product={p}
                        checked={avail[p.id]}
                        onToggle={(v) =>
                          setAvail((prev) => ({ ...prev, [p.id]: v }))
                        }
                        badge={
                          isToday
                            ? { text: "Today!", tone: "brand" }
                            : p.weekly_day != null
                            ? {
                                text: DAY_NAMES[p.weekly_day],
                                tone: "muted",
                              }
                            : null
                        }
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Festival Special — countdown */}
            {festival.length > 0 && (
              <section>
                <SectionHeading category="festival_special" />
                <div className="space-y-2.5">
                  {festival.map((p) => {
                    const cd = countdownLabel(p.festival_deadline);
                    return (
                      <AvailRow
                        key={p.id}
                        product={p}
                        checked={avail[p.id]}
                        onToggle={(v) =>
                          setAvail((prev) => ({ ...prev, [p.id]: v }))
                        }
                        badge={cd ? { text: cd, tone: "amber" } : null}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Always Available */}
            {always.length > 0 && (
              <section>
                <SectionHeading category="always_available" />
                <div className="space-y-2.5">
                  {always.map((p) => (
                    <AvailRow
                      key={p.id}
                      product={p}
                      checked={avail[p.id]}
                      onToggle={(v) =>
                        setAvail((prev) => ({ ...prev, [p.id]: v }))
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Pre-order */}
            {preorder.length > 0 && (
              <section>
                <SectionHeading category="preorder" />
                <div className="space-y-2.5">
                  {preorder.map((p) => (
                    <AvailRow
                      key={p.id}
                      product={p}
                      checked={avail[p.id]}
                      onToggle={(v) =>
                        setAvail((prev) => ({ ...prev, [p.id]: v }))
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Sticky publish bar */}
      {hasAnything && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-app px-4 py-3">
            <Button
              variant="brand"
              className="w-full"
              onClick={publish}
              loading={saving}
            >
              Publish Today&apos;s Menu · {liveCount} live
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({
  category,
}: {
  category: keyof typeof CATEGORY_META;
}) {
  const meta = CATEGORY_META[category];
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-ink">
      <span>{meta.emoji}</span>
      {meta.label}
    </h2>
  );
}

function Thumb({ product }: { product: Product }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function AvailRow({
  product,
  checked,
  onToggle,
  badge,
}: {
  product: Product;
  checked: boolean;
  onToggle: (next: boolean) => void;
  badge?: { text: string; tone: "brand" | "amber" | "muted" } | null;
}) {
  const toneClass =
    badge?.tone === "brand"
      ? "bg-brand/10 text-brand"
      : badge?.tone === "amber"
      ? "bg-amber-100 text-amber-700"
      : "bg-background text-muted";
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-white p-3 transition-colors",
        checked ? "border-line" : "border-line opacity-60"
      )}
    >
      <Thumb product={product} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-ink">{product.name}</p>
          {badge && (
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                toneClass
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
        <p className="text-xs text-muted">{formatPrice(product.price)}</p>
      </div>
      <Toggle checked={checked} onChange={onToggle} activeColor="bg-brand" />
    </div>
  );
}
