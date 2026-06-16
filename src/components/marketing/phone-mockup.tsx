/**
 * Pure-CSS phone frame showing a jewellery storefront preview.
 * No images — built from divs so it loads instantly and scales crisply.
 * UPI-only: the single customer action is "Pay via UPI".
 */
export function PhoneMockup() {
  const items = [
    { name: "Gold Earrings", price: "₹450", emoji: "💎", tint: "from-amber-100 to-yellow-100" },
    { name: "Silver Bracelet", price: "₹280", emoji: "📿", tint: "from-zinc-100 to-slate-200" },
    { name: "Pearl Necklace", price: "₹890", emoji: "🦪", tint: "from-pink-100 to-rose-100" },
  ];

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      <div className="rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.8rem] bg-[#FBF8FF]">
          {/* notch */}
          <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

          <div className="px-4 pb-4 pt-8">
            {/* store header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#7C3AED] text-2xl font-bold text-white ring-[3px] ring-[#F97316]">
                💍
              </div>
              <p className="mt-2 text-sm font-extrabold text-ink">
                Riya&apos;s Jewellery
              </p>
              <p className="text-[10px] text-muted">Handmade with love ✨</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-whatsapp/10 px-2 py-0.5 text-[9px] font-semibold text-whatsapp">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" /> Open · New collection
              </span>
            </div>

            {/* product cards */}
            <div className="mt-3 space-y-2">
              {items.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-2"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${p.tint} text-xl`}
                  >
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-ink">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-bold text-brand">{p.price}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-upi px-2 py-1 text-[9px] font-bold text-white">
                    Pay via UPI
                  </span>
                </div>
              ))}
            </div>

            {/* made with mystorr footer */}
            <div className="mt-3 flex items-center justify-center gap-1 text-[9px] font-bold text-brand">
              Made with Mystorr <span aria-hidden>⚡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
