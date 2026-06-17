"use client";

import * as React from "react";
import Image from "next/image";
import { IndianRupee } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InitialsAvatar } from "@/components/initials-avatar";
import { formatPrice, upiPayLink, cn } from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

export function StoreProductCard({
  product,
  store,
  storeOpen,
  variant = "compact",
}: {
  product: Product;
  store: Store;
  storeOpen: boolean;
  /** "compact" = square photo (2-col grid); "full" = 4:5 photo (single column). */
  variant?: "compact" | "full";
}) {
  const full = variant === "full";
  const supabase = React.useMemo(() => createClient(), []);
  const soldOut = product.quantity_available === 0;
  const limited =
    product.quantity_available > 0 && product.quantity_available !== -1;
  const disabled = soldOut || !storeOpen;

  async function payViaUpi() {
    if (disabled || !store.upi_id) return;
    // Record a pending order before opening the UPI app.
    try {
      await supabase.from("orders").insert({
        store_id: store.id,
        product_id: product.id,
        product_name: product.name,
        amount: product.price,
        status: "pending",
      });
    } catch {
      // Don't block payment if logging fails.
    }
    const url = upiPayLink({
      upiId: store.upi_id,
      displayName: store.display_name,
      price: product.price,
    });
    window.location.href = url;
  }

  return (
    <div className="overflow-hidden rounded-card bg-card shadow-card">
      <div
        className={cn(
          "relative w-full bg-background",
          full ? "aspect-[4/5]" : "aspect-square"
        )}
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            loading="lazy"
            sizes={full ? "(max-width: 480px) 100vw, 448px" : "(max-width: 480px) 50vw, 240px"}
            className="object-cover"
          />
        ) : (
          <InitialsAvatar name={product.name} className={full ? "text-5xl" : "text-3xl"} />
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className={cn("font-bold text-white", full ? "text-lg" : "text-sm")}>
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className={full ? "p-4" : "p-2.5"}>
        <p
          className={cn(
            "font-medium text-ink",
            full
              ? "line-clamp-2 text-base"
              : "line-clamp-2 min-h-[34px] text-[13px]"
          )}
        >
          {product.name}
        </p>
        <div className={cn("flex items-center justify-between gap-1", full ? "mt-1.5" : "mt-1")}>
          <span className={cn("font-bold text-brand", full ? "text-xl" : "text-[15px]")}>
            {formatPrice(product.price)}
          </span>
          {limited && (
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              {product.quantity_available} left
            </span>
          )}
        </div>

        <button
          onClick={payViaUpi}
          disabled={disabled || !store.upi_id}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg font-bold text-white transition-colors",
            full ? "mt-3 h-12 text-base" : "mt-2.5 h-11 text-sm",
            disabled || !store.upi_id ? "bg-zinc-300" : "bg-upi hover:bg-upi/90"
          )}
        >
          <IndianRupee className={full ? "h-5 w-5" : "h-4 w-4"} />
          Pay via UPI
        </button>
      </div>
    </div>
  );
}
