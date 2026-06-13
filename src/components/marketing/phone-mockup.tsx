import { WhatsAppIcon } from "@/components/icons";

/**
 * Pure-CSS phone frame showing a mini storefront preview for the hero.
 * No images — built from divs so it loads instantly and scales crisply.
 */
export function PhoneMockup() {
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
                M
              </div>
              <p className="mt-2 text-sm font-extrabold text-ink">Meena&apos;s Kitchen</p>
              <p className="text-[10px] text-muted">Fresh home-cooked tiffin</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-whatsapp/10 px-2 py-0.5 text-[9px] font-semibold text-whatsapp">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" /> Open
              </span>
            </div>

            {/* product cards */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { name: "Veg Thali", price: "₹120", tint: "from-orange-100 to-amber-100" },
                { name: "Paneer Roll", price: "₹90", tint: "from-purple-100 to-violet-100" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="overflow-hidden rounded-xl border border-line bg-white"
                >
                  <div
                    className={`flex aspect-square items-center justify-center bg-gradient-to-br ${p.tint} text-2xl`}
                  >
                    🍱
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
