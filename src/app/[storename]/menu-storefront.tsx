import Image from "next/image";
import { MapPin, Truck, Bell } from "lucide-react";
import { MenuStatusBar } from "./menu-status-bar";
import { MenuItemCard } from "./menu-item-card";
import { StoreGrowthBanner, StoreFooter } from "./store-chrome";
import { PhotoFallback } from "@/components/photo-fallback";
import { placeholderTheme } from "@/lib/category-theme";
import {
  countdownLabel,
  istNow,
  daysUntil,
  getOrderingStatus,
  DAY_NAMES,
} from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

export function MenuStorefront({
  store,
  products,
}: {
  store: Store;
  products: Product[];
}) {
  const now = istNow();
  const today = now.getDay();
  const ph = placeholderTheme(store.category);

  // Ordering disabled (visual) when not open — buttons stay live unless closed.
  const status = getOrderingStatus(store, now);
  const ordersClosed = status.state !== "open";

  const todaysSpecial = products.filter(
    (p) => p.category === "todays_special" && p.is_todays_special && p.is_available
  );
  const weekly = products.filter(
    (p) =>
      p.category === "weekly_special" &&
      p.is_available &&
      p.weekly_day === today
  );
  const festival = products.filter(
    (p) =>
      p.category === "festival_special" &&
      p.is_available &&
      (daysUntil(p.festival_deadline, now) ?? 1) >= 0
  );
  const always = products.filter(
    (p) => p.category === "always_available" && p.is_available
  );
  const preorder = products.filter(
    (p) =>
      p.category === "preorder" &&
      p.is_available &&
      (daysUntil(p.festival_deadline, now) ?? 1) >= 0
  );

  const isEmpty =
    todaysSpecial.length +
      weekly.length +
      festival.length +
      always.length +
      preorder.length ===
    0;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: "#FFFBF1",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(201,162,39,0.06) 0px, rgba(201,162,39,0.06) 1px, transparent 1px, transparent 34px)",
      }}
    >
      <StoreGrowthBanner />
      {/* subtle food emoji backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 select-none text-[64px] leading-[3.2] opacity-[0.04]"
      >
        🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜🍱🍛🍲🥘🍜
      </div>

      <div className="relative mx-auto max-w-app px-4 pb-8 pt-4">
        {/* Kitchen header */}
        <header className="relative mt-3 rounded-2xl border border-[#EFE3C0] bg-white p-5 pt-6 text-center shadow-card">
          {/* Decorative gold ribbon-tab (booklet motif) */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-7 w-14 -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: "#C9A227",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 68%, 0 100%)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
            }}
          />
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-[3px] ring-[#C9A227]">
            {store.profile_image_url ? (
              <Image
                src={store.profile_image_url}
                alt={store.display_name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <PhotoFallback accent={ph.accent} />
            )}
          </div>

          <h1 className="mt-3 text-[26px] font-extrabold leading-tight text-ink">
            {store.display_name}
          </h1>
          {store.bio && (
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{store.bio}</p>
          )}

          {/* Info pills */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {store.instagram_handle && (
              <a
                href={`https://instagram.com/${store.instagram_handle}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted"
              >
                <MapPin className="h-3 w-3" /> @{store.instagram_handle}
              </a>
            )}
            {store.min_order && (
              <span className="inline-flex items-center rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted">
                Min order {store.min_order}
              </span>
            )}
            {store.delivery_info && (
              <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted">
                <Truck className="h-3 w-3" /> {store.delivery_info}
              </span>
            )}
          </div>

          {store.advance_order_notice && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
              <Bell className="h-3 w-3" /> {store.advance_order_notice}
            </p>
          )}
        </header>

        {/* Ordering status */}
        <div className="mt-3">
          <MenuStatusBar store={store} />
        </div>

        {/* Sections */}
        {isEmpty ? (
          <div className="mt-6 rounded-2xl border border-dashed border-orange-200 bg-white py-14 text-center">
            <p className="text-3xl">🍳</p>
            <p className="mt-2 text-sm font-semibold text-ink">
              No menu posted yet for today
            </p>
            <p className="mt-1 text-xs text-muted">
              Check back soon — fresh food is on the way!
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-7">
            {/* Today's Special */}
            {todaysSpecial.length > 0 && (
              <section>
                <SectionTitle emoji="⭐" title="Today's Special" />
                <div className="space-y-3.5">
                  {todaysSpecial.map((p) => (
                    <MenuItemCard
                      key={p.id}
                      product={p}
                      store={store}
                      variant="feature"
                      accent="orange"
                      storeClosed={ordersClosed}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Weekly Special (today only) */}
            {weekly.length > 0 && (
              <section>
                <SectionTitle
                  emoji="📅"
                  title={`${DAY_NAMES[today]} Special`}
                />
                <div className="divide-y divide-[#EFE3C0] overflow-hidden rounded-xl border border-[#EFE3C0] bg-white/80">
                  {weekly.map((p) => (
                    <MenuItemCard
                      key={p.id}
                      product={p}
                      store={store}
                      variant="compact"
                      accent="purple"
                      badge="This week"
                      storeClosed={ordersClosed}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Festival Special */}
            {festival.length > 0 && (
              <section>
                <SectionTitle emoji="🎉" title="Festival Special" />
                <div className="divide-y divide-[#EFE3C0] overflow-hidden rounded-xl border border-[#EFE3C0] bg-white/80">
                  {festival.map((p) => (
                    <MenuItemCard
                      key={p.id}
                      product={p}
                      store={store}
                      variant="compact"
                      accent="amber"
                      badge={
                        countdownLabel(p.festival_deadline, now) ||
                        p.festival_name ||
                        "Special"
                      }
                      storeClosed={ordersClosed}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Always Available */}
            {always.length > 0 && (
              <section>
                <SectionTitle emoji="🍱" title="Always Available" />
                <div className="divide-y divide-[#EFE3C0] overflow-hidden rounded-xl border border-[#EFE3C0] bg-white/80">
                  {always.map((p) => (
                    <MenuItemCard
                      key={p.id}
                      product={p}
                      store={store}
                      variant="compact"
                      accent="purple"
                      storeClosed={ordersClosed}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Pre-order */}
            {preorder.length > 0 && (
              <section>
                <SectionTitle emoji="📞" title="Pre-order" />
                <div className="divide-y divide-[#EFE3C0] overflow-hidden rounded-xl border border-[#EFE3C0] bg-white/80">
                  {preorder.map((p) => (
                    <MenuItemCard
                      key={p.id}
                      product={p}
                      store={store}
                      variant="preorder"
                      accent="purple"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Footer */}
        <StoreFooter />
      </div>
    </div>
  );
}

// Menu-booklet section header: centred title framed by a thin gold rule above
// and below, matching the page's gold tone (#C9A227).
function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="mb-3">
      <div className="h-px w-full" style={{ backgroundColor: "#C9A227" }} aria-hidden />
      <h2 className="py-2 text-center text-lg font-extrabold tracking-wide text-ink">
        {emoji} {title}
      </h2>
      <div className="h-px w-full" style={{ backgroundColor: "#C9A227" }} aria-hidden />
    </div>
  );
}
