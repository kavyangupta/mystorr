"use client";

import * as React from "react";
import Image from "next/image";
import { IndianRupee } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, upiPayLink, cn } from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

export function StoreProductCard({
  product,
  store,
  storeOpen,
}: {
  product: Product;
  store: Store;
  storeOpen: boolean;
}) {
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
      <div className="relative aspect-square w-full bg-background">
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
          <div className="flex h-full w-full items-center justify-center text-muted">
            <IndianRupee className="h-8 w-8 opacity-30" />
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-sm font-bold text-white">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="line-clamp-2 min-h-[34px] text-[13px] font-medium text-ink">
          {product.name}
        </p>
        <div className="mt-1 flex items-center justify-between gap-1">
          <span className="text-[15px] font-bold text-brand">
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
            "mt-2.5 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-bold text-white transition-colors",
            disabled || !store.upi_id ? "bg-zinc-300" : "bg-upi hover:bg-upi/90"
          )}
        >
          <IndianRupee className="h-4 w-4" />
          Pay via UPI
        </button>
      </div>
    </div>
  );
}
