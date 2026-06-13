"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  UtensilsCrossed,
  LogOut,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ConfirmDialog } from "@/components/ui/modal";
import { ProductFormModal } from "@/components/product-form-modal";
import { useToast } from "@/components/ui/toast";
import {
  appHost,
  appUrl,
  formatPrice,
  timeAgo,
  todayLabel,
  cn,
  CATEGORY_META,
} from "@/lib/utils";
import type { Order, Product, Store } from "@/lib/types";

export default function DashboardClient({
  store,
  initialProducts,
  initialOrders,
}: {
  store: Store;
  initialProducts: Product[];
  initialOrders: Order[];
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const toast = useToast();

  const [isOpen, setIsOpen] = React.useState(store.is_open);
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [orders] = React.useState<Order[]>(initialOrders);
  const [copied, setCopied] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const storeUrl = `${appUrl()}/${store.store_name}`;
  const storeUrlLabel = `${appHost()}/${store.store_name}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy link", "error");
    }
  }

  async function toggleStoreOpen(next: boolean) {
    setIsOpen(next);
    const { error } = await supabase
      .from("stores")
      .update({ is_open: next })
      .eq("id", store.id);
    if (error) {
      setIsOpen(!next);
      toast("Could not update store status", "error");
    }
  }

  async function toggleAvailable(p: Product, next: boolean) {
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, is_available: next } : x))
    );
    const { error } = await supabase
      .from("products")
      .update({ is_available: next })
      .eq("id", p.id);
    if (error) {
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, is_available: !next } : x))
      );
      toast("Could not update product", "error");
    }
  }

  function onSaved(saved: Product) {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === saved.id);
      return exists
        ? prev.map((x) => (x.id === saved.id ? saved : x))
        : [saved, ...prev];
    });
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", deleting.id);
    setDeleteLoading(false);
    if (error) {
      toast("Could not delete product", "error");
      return;
    }
    setProducts((prev) => prev.filter((x) => x.id !== deleting.id));
    setDeleting(null);
    toast("Product deleted", "success");
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-app items-center justify-between gap-2 px-4">
          <span className="text-base font-bold text-brand">MYSTORR</span>
          <button
            onClick={copyLink}
            className="flex min-w-0 items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted hover:bg-background"
          >
            <span className="truncate">{storeUrlLabel}</span>
            {copied ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-whatsapp" />
            ) : (
              <Copy className="h-3.5 w-3.5 shrink-0" />
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line bg-brand/10"
            >
              {store.profile_image_url ? (
                <Image
                  src={store.profile_image_url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-brand">
                  {store.display_name.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-white shadow-card">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink hover:bg-background"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-background"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-app space-y-4 px-4 py-4">
        {copied && (
          <p className="text-center text-xs font-medium text-whatsapp">
            Link copied to clipboard
          </p>
        )}

        {/* Morning update prompt (menu mode) */}
        {store.store_mode === "menu" && (
          <Link href="/dashboard/update-menu" className="block">
            <section className="rounded-xl bg-gradient-to-br from-brand to-[#6D63D6] p-4 text-white shadow-card">
              <p className="text-base font-extrabold">Good morning! 🍳</p>
              <p className="mt-0.5 text-sm text-white/85">
                {todayLabel()}
              </p>
              <p className="mt-1 text-sm text-white/85">
                Set what you&apos;re cooking today and publish your menu.
              </p>
              <span className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-bold text-brand">
                <UtensilsCrossed className="h-4 w-4" /> Update today&apos;s menu
              </span>
            </section>
          </Link>
        )}

        {/* Store status */}
        <section className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink">
                Your store is{" "}
                <span className={isOpen ? "text-whatsapp" : "text-muted"}>
                  {isOpen ? "Open" : "Closed"}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {isOpen
                  ? "Customers can browse and order"
                  : "Customers see a closed banner"}
              </p>
            </div>
            <Toggle checked={isOpen} onChange={toggleStoreOpen} />
          </div>

          <div className="mt-3 flex gap-2">
            <a
              href={`/${store.store_name}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4" /> View my store
              </Button>
            </a>
          </div>
        </section>

        {/* Products */}
        <section className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              {store.store_mode === "menu" ? "Your Dishes" : "Your Products"}
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-muted">
                {products.length}
              </span>
            </h2>
            <Button
              size="sm"
              className="min-h-[36px]"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />{" "}
              {store.store_mode === "menu" ? "Add Dish" : "Add Product"}
            </Button>
          </div>

          {products.length === 0 ? (
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-10 text-muted hover:border-brand hover:text-brand"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm font-medium">
                {store.store_mode === "menu"
                  ? "Add your first dish"
                  : "Add your first product"}
              </span>
            </button>
          ) : (
            <div className="mt-3 divide-y divide-line">
              {products.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  menuMode={store.store_mode === "menu"}
                  onEdit={() => {
                    setEditing(p);
                    setModalOpen(true);
                  }}
                  onDelete={() => setDeleting(p)}
                  onToggleAvailable={(next) => toggleAvailable(p, next)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Orders */}
        <section className="rounded-xl bg-card p-4 shadow-card">
          <h2 className="text-base font-bold text-ink">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-line py-8 text-center">
              <p className="text-sm text-muted">No orders yet</p>
              <p className="mt-1 text-xs text-muted">
                Share your store link to get started
              </p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-line">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-ink">
                      {o.product_name}
                    </p>
                    <p className="text-xs text-muted">{timeAgo(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-whatsapp">
                      {formatPrice(o.amount)}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-amber-700">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        storeId={store.id}
        storeMode={store.store_mode}
        product={editing}
        onSaved={onSaved}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete product?"
        message={`"${deleting?.name}" will be permanently removed from your store.`}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function ProductRow({
  product,
  menuMode,
  onEdit,
  onDelete,
  onToggleAvailable,
}: {
  product: Product;
  menuMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: (next: boolean) => void;
}) {
  const qty = product.quantity_available;
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-background">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-ink">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-muted">{formatPrice(product.price)}</span>
          {qty === -1 ? (
            <span className="text-[11px] text-muted">Unlimited</span>
          ) : qty === 0 ? (
            <span className="rounded-full bg-red-100 px-1.5 text-[11px] font-semibold text-red-600">
              Sold Out
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-1.5 text-[11px] font-semibold text-amber-700">
              {qty} left
            </span>
          )}
        </div>
        {menuMode && (
          <div className="mt-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
              {CATEGORY_META[product.category].emoji}{" "}
              {CATEGORY_META[product.category].label}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          checked={product.is_available}
          onChange={onToggleAvailable}
          label="Available"
        />
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-ink"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-red-600"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
