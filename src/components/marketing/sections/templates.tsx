import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealPop } from "@/components/marketing/reveal";
import { buttonVariants } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/initials-avatar";
import { cn } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEMPLATES } from "@/lib/marketing-content";

type DemoStore = {
  store_name: string;
  display_name: string | null;
  profile_image_url: string | null;
};

// Best-effort fetch of the live demo stores so each card shows a real photo
// and name. Falls back silently to the hardcoded template copy.
async function getDemoStores(): Promise<Record<string, DemoStore>> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("stores")
      .select("store_name, display_name, profile_image_url")
      .in(
        "store_name",
        TEMPLATES.map((t) => t.slug)
      );
    const map: Record<string, DemoStore> = {};
    for (const s of (data as DemoStore[]) || []) map[s.store_name] = s;
    return map;
  } catch {
    return {};
  }
}

export async function Templates() {
  const demo = await getDemoStores();

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            Start in seconds
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Choose your template
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted">
            Preview a real shop, then make it yours. Your products, your photos —
            ready in minutes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t, i) => {
            const store = demo[t.slug];
            const name = store?.display_name || t.name;
            const image = store?.profile_image_url || null;
            return (
              <RevealPop key={t.slug} delay={(i % 4) * 0.1}>
                <div className="card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                  {/* Preview */}
                  <Link
                    href={`/${t.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-[4/3] w-full bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]"
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <InitialsAvatar name={name} className="text-5xl" />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
                      {t.emoji} {t.label}
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-ink">{name}</h3>
                    <p className="mt-1 text-sm text-muted">{t.tagline}</p>

                    <div className="mt-5 flex flex-col gap-2">
                      <Link
                        href={`/login?category=${t.category}`}
                        className={cn(
                          buttonVariants({ variant: "brand", size: "sm" }),
                          "btn-glow w-full"
                        )}
                      >
                        Use this template
                      </Link>
                      <Link
                        href={`/${t.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-sm font-semibold text-brand hover:underline"
                      >
                        Preview this shop →
                      </Link>
                    </div>
                  </div>
                </div>
              </RevealPop>
            );
          })}
        </div>
      </div>
    </section>
  );
}
