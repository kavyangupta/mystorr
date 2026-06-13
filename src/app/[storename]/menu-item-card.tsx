"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, UtensilsCrossed, Clock, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { WhatsAppIcon } from "@/components/icons";
import {
  formatPrice,
  whatsappMenuOrderLink,
  upiPayLink,
  servesLabel,
  cn,
} from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

type Variant = "feature" | "compact" | "preorder";
type Accent = "orange" | "purple" | "amber";

const ACCENTS: Record<Accent, { badge: string; price: string; button: string }> = {
  orange: {
    badge: "bg-orange-100 text-orange-700",
    price: "text-orange-600",
    button: "bg-[#F97316] hover:bg-[#ea6a0c]",
  },
  purple: {
    badge: "bg-brand/10 text-brand",
    price: "text-brand",
    button: "bg-brand hover:bg-brand/90",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800",
    price: "text-amber-700",
    button: "bg-amber-600 hover:bg-amber-700",
  },
};

export function MenuItemCard({
  product,
  store,
  variant = "compact",
  accent = "purple",
  badge,
  storeClosed,
}: {
  product: Product;
  store: Store;
  variant?: Variant;
  accent?: Accent;
  badge?: string | null;
  storeClosed?: boolean;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const a = ACCENTS[accent];

  const limited =
    product.quantity_available > 0 && product.quantity_available !== -1;
  const soldOut = product.quantity_available === 0;
  const disabled = soldOut || !!storeClosed;
  const maxQty = limited ? product.quantity_available : 99;

  const [qty, setQty] = React.useState(1);
  const total = product.price * qty;

  function orderOnWhatsApp() {
    if (disabled || !store.whatsapp_number) return;
    window.open(
      whatsappMenuOrderLink({
        whatsapp: store.whatsapp_number,
        productName: product.name,
        price: product.price,
        quantity: qty,
        displayName: store.display_name,
        preorder: variant === "preorder",
      }),
      "_blank"
    );
  }

  async function payViaUpi() {
    if (disabled || !store.upi_id) return;
    try {
      await supabase.from("orders").insert({
        store_id: store.id,
        product_id: product.id,
        product_name: `${qty} × ${product.name}`,
        amount: total,
        status: "pending",
      });
    } catch {
      /* don't block payment */
    }
    window.location.href = upiPayLink({
      upiId: store.upi_id,
      displayName: store.display_name,
      price: total,
    });
  }

  const dietary = product.dietary_tags || [];

  // ----- Pre-order list row ------------------------------------------------
  if (variant === "preorder") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-orange-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt=""
              fill
              loading="lazy"
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-orange-300">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{product.name}</p>
          {product.description && (
            <p className="truncate text-xs text-muted">{product.description}</p>
          )}
          <span className={cn("text-sm font-bold", a.price)}>
            {formatPrice(product.price)}
          </span>
        </div>
        <button
          onClick={orderOnWhatsApp}
          disabled={!store.whatsapp_number}
          className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-brand/90 disabled:bg-zinc-300"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" /> Enquire
        </button>
      </div>
    );
  }

  // ----- Compact grid card -------------------------------------------------
  if (variant === "compact") {
    return (
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="relative aspect-square w-full bg-orange-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(max-width: 480px) 50vw, 240px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-orange-200">
              <UtensilsCrossed className="h-7 w-7" />
            </div>
          )}
          {badge && (
            <span
              className={cn(
                "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold",
                a.badge
              )}
            >
              {badge}
            </span>
          )}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-sm font-bold text-white">Sold Out</span>
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="line-clamp-2 min-h-[34px] text-[13px] font-semibold text-ink">
            {product.name}
          </p>
          <span className={cn("text-[15px] font-bold", a.price)}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={orderOnWhatsApp}
            disabled={disabled || !store.whatsapp_number}
            className={cn(
              "mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition-colors",
              disabled || !store.whatsapp_number ? "bg-zinc-300" : a.button
            )}
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> Order
          </button>
        </div>
      </div>
    );
  }

  // ----- Feature card (Today's Special) ------------------------------------
  return (
    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-card">
      <div className="relative h-[200px] w-full bg-orange-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 480px) 100vw, 448px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-orange-200">
            <UtensilsCrossed className="h-10 w-10" />
          </div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold",
            badge ? a.badge : "bg-orange-100 text-orange-700"
          )}
        >
          {badge || "Today Only"}
        </span>
        {limited && !soldOut && product.quantity_available <= 5 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white">
            Only {product.quantity_available} left!
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-ink">
              Sold out for today
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold text-ink">{product.name}</h3>
          <span className={cn("shrink-0 text-lg font-extrabold", a.price)}>
            {formatPrice(product.price)}
          </span>
        </div>

        {product.description && (
          <p className="mt-1 text-sm text-muted">{product.description}</p>
        )}

        {/* Meta pills */}
        {(product.serves || product.prep_time_mins || dietary.length > 0) && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.serves && (
              <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px] font-medium text-muted">
                <Users className="h-3 w-3" /> {servesLabel(product.serves)}
              </span>
            )}
            {product.prep_time_mins ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px] font-medium text-muted">
                <Clock className="h-3 w-3" /> Ready in {product.prep_time_mins} min
              </span>
            ) : null}
            {dietary.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-whatsapp/10 px-2 py-1 text-[11px] font-medium text-whatsapp"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {!disabled && (
          <>
            {/* Quantity stepper */}
            <div className="mt-3.5 flex items-center justify-between">
              <span className="text-sm font-medium text-muted">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink disabled:opacity-40"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-base font-bold text-ink">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink disabled:opacity-40"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {store.whatsapp_number && (
              <button
                onClick={orderOnWhatsApp}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-bold text-white hover:bg-whatsapp/90"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Order {qty > 1 ? `${qty} ` : ""}· {formatPrice(total)}
              </button>
            )}

            {store.upi_id && (
              <button
                onClick={payViaUpi}
                className="mt-2 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-upi/30 bg-upi/5 text-sm font-bold text-upi hover:bg-upi/10"
              >
                Pay {formatPrice(total)} via UPI
              </button>
            )}
          </>
        )}

        {disabled && !soldOut && (
          <p className="mt-3 rounded-lg bg-zinc-100 py-2.5 text-center text-xs font-medium text-muted">
            Ordering is closed right now
          </p>
        )}
      </div>
    </div>
  );
}
