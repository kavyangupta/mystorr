import { WhatsAppIcon } from "@/components/icons";

/**
 * Pure-CSS phone frame showing a genuinely Indian tiffin storefront preview.
 * No images — built from divs so it loads instantly and scales crisply.
 */
export function PhoneMockup() {
  const items = [
    { name: "Dal Makhani", price: "₹120", emoji: "🍛", tint: "from-orange-100 to-amber-100" },
    { name: "Paneer Roll", price: "₹90", emoji: "🌯", tint: "from-purple-100 to-violet-100" },
    { name: "Veg Thali", price: "₹150", emoji: "🍱", tint: "from-rose-100 to-orange-100" },
    { name: "Masala Dosa", price: "₹80", emoji: "🥘", tint: "from-amber-100 to-yellow-100" },
  ];

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      <div className="rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.8rem] bg-[#FFFBF5]">
          {/* notch */}
          <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

          <div className="px-4 pb-5 pt-8">
            {/* store header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#7C3AED] text-2xl font-bold text-white ring-[3px] ring-[#F97316]">
                🍲
              </div>
              <p className="mt-2 text-sm font-extrabold text-ink">
                Sharma Ji Tiffin
              </p>
              <p className="text-[10px] text-muted">Ghar ka khana, roz fresh</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-whatsapp/10 px-2 py-0.5 text-[9px] font-semibold text-whatsapp">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" /> Open · Order by 11 AM
              </span>
            </div>

            {/* today's special banner */}
            <div className="mt-3 rounded-lg bg-orange-50 px-2.5 py-1.5 text-center text-[10px] font-bold text-orange-700">
              ⭐ Aaj ka Special Menu
            </div>

            {/* product cards */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {items.map((p) => (
                <div
                  key={p.name}
                  className="overflow-hidden rounded-xl border border-line bg-white"
                >
                  <div
                    className={`flex aspect-square items-center justify-center bg-gradient-to-br ${p.tint} text-2xl`}
                  >
                    {p.emoji}
                  </div>
                  <div className="p-1.5">
                    <p className="truncate text-[10px] font-semibold text-ink">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-bold text-orange-600">{p.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* whatsapp button */}
            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-whatsapp py-2 text-[11px] font-bold text-white">
              <WhatsAppIcon className="h-3 w-3" /> Order on WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
