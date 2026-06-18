import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { StoreProductCard } from "./store-product-card";
import { MenuStorefront } from "./menu-storefront";
import { StoreGrowthBanner, StoreFooter } from "./store-chrome";
import { PhotoFallback } from "@/components/photo-fallback";
import { categoryTheme, placeholderTheme } from "@/lib/category-theme";
import { APP_NAME } from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getStore(storename: string): Promise<Store | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("stores")
    .select("*")
    .eq("store_name", storename)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { storename: string };
}): Promise<Metadata> {
  const store = await getStore(params.storename);
  if (!store) return { title: "Store not found" };
  return {
    title: `${store.display_name} · ${APP_NAME}`,
    description: store.bio || `Order from ${store.display_name} on ${APP_NAME}`,
    openGraph: {
      title: store.display_name,
      description: store.bio || "",
      images: store.profile_image_url ? [store.profile_image_url] : [],
    },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: { storename: string };
}) {
  const store = await getStore(params.storename);
  if (!store) notFound();

  const supabase = createAdminClient();
  const isMenu = store.store_mode === "menu";

  // Menu mode: completely separate storefront experience.
  if (isMenu) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });
    return <MenuStorefront store={store} products={(data as Product[]) || []} />;
  }

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_available", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });
  const products = (data as Product[]) || [];

  // Layout density by category (visuals/branding unchanged):
  // jewellery & clothing → single-column 4:5 cards; homemade (and legacy
  // catalogue stores with no category) → 2-col square grid.
  const singleColumn =
    store.category === "jewellery" || store.category === "clothing";

  // Category identity (matches the homepage template cards). Null for legacy
  // no-category stores, which keep the original purple/brand look.
  const theme = categoryTheme(store.category);
  const ph = placeholderTheme(store.category);

  return (
    <div className="min-h-screen bg-background">
      <StoreGrowthBanner />
      <div className="mx-auto max-w-app px-4 pb-6 pt-4">
        {!store.is_open && (
          <div className="mb-4 rounded-lg bg-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-zinc-700">
            This shop is currently closed
          </div>
        )}

        {/* Store header */}
        <header
          className={
            "rounded-xl p-5 text-center shadow-card" +
            (theme ? "" : " bg-gradient-to-b from-white to-[#F5F3FF]")
          }
          style={theme ? { backgroundColor: theme.tint } : undefined}
        >
          <div
            className={
              "mx-auto h-[90px] w-[90px] overflow-hidden rounded-full" +
              (theme ? "" : " ring-[3px] ring-brand")
            }
            style={theme ? { boxShadow: `0 0 0 3px ${theme.accent}` } : undefined}
          >
            {store.profile_image_url ? (
              <Image
                src={store.profile_image_url}
                alt={store.display_name}
                width={90}
                height={90}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <PhotoFallback accent={ph.accent} />
            )}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-ink">
            {store.display_name}
          </h1>
          {store.bio && (
            <p className="mt-1.5 line-clamp-2 text-sm text-muted">{store.bio}</p>
          )}

          <div className="mt-2 flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                store.is_open
                  ? theme
                    ? ""
                    : "bg-whatsapp/10 text-whatsapp"
                  : "bg-zinc-100 text-muted"
              }`}
              style={
                store.is_open && theme
                  ? { backgroundColor: `${theme.accent}1A`, color: theme.accent }
                  : undefined
              }
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  store.is_open ? (theme ? "" : "bg-whatsapp") : "bg-muted"
                }`}
                style={
                  store.is_open && theme
                    ? { backgroundColor: theme.accent }
                    : undefined
                }
              />
              {store.is_open ? "Open" : "Closed"}
            </span>
          </div>

          {store.instagram_handle && (
            <a
              href={`https://instagram.com/${store.instagram_handle}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-muted hover:text-brand"
            >
              @{store.instagram_handle}
            </a>
          )}

        </header>

        {/* Menu banner */}
        {isMenu && (
          <div className="mt-4 rounded-lg bg-amber-50 px-4 py-2.5 text-center text-sm font-semibold text-amber-800">
            🍱 Today&apos;s Menu
          </div>
        )}

        {/* Products */}
        <section className="mt-4">
          <h2 className="mb-3 text-base font-bold text-ink">
            {isMenu ? "Today's Menu" : "Products"}
          </h2>

          {products.length === 0 ? (
            isMenu ? (
              <div className="rounded-xl border border-dashed border-line bg-white py-12 text-center">
                <p className="text-sm text-muted">
                  No menu posted yet for today. Check back soon 🍱
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-line bg-white py-12 text-center">
                <p className="text-sm text-muted">No products yet</p>
              </div>
            )
          ) : singleColumn ? (
            <div className="space-y-4">
              {products.map((p) => (
                <StoreProductCard
                  key={p.id}
                  product={p}
                  store={store}
                  storeOpen={store.is_open}
                  variant="full"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {products.map((p) => (
                <StoreProductCard
                  key={p.id}
                  product={p}
                  store={store}
                  storeOpen={store.is_open}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer — viral loop */}
        <StoreFooter />
      </div>
    </div>
  );
}
