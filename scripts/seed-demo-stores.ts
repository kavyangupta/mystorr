/**
 * One-time seed: create 4 demo seller accounts directly via the Supabase
 * service-role key (bypasses signup + RLS).
 *
 * Run from the project root:
 *   node --env-file=.env.local scripts/seed-demo-stores.ts
 *
 * Idempotent: re-running updates the existing store rows and replaces their
 * demo products rather than creating duplicates.
 */
const { createClient } = require("@supabase/supabase-js");
const nodeCrypto = require("node:crypto");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.\n" +
      "  Run with:  node --env-file=.env.local scripts/seed-demo-stores.ts"
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type DemoProduct = { name: string; price: number }; // price in paise
type DemoStore = {
  slug: string;
  category: "jewellery" | "clothing" | "homemade" | "food";
  displayName: string;
  bio: string;
  products: DemoProduct[];
};

// ₹ amounts as paise (₹450 = 45000).
const STORES: DemoStore[] = [
  {
    slug: "riyas-jewellery",
    category: "jewellery",
    displayName: "Riya's Jewellery",
    bio: "Handmade in Jaipur",
    products: [
      { name: "Gold Hoop Earrings", price: 45000 },
      { name: "Silver Bracelet", price: 68000 },
    ],
  },
  {
    slug: "sanas-clothing",
    category: "clothing",
    displayName: "Sana's Clothing",
    bio: "Sarees & suits",
    products: [
      { name: "Cotton Saree", price: 120000 },
      { name: "Suit Set", price: 180000 },
    ],
  },
  {
    slug: "sunitas-pickles",
    category: "homemade",
    displayName: "Sunita's Pickles",
    bio: "Pickles & snacks",
    products: [
      { name: "Mango Pickle", price: 22000 },
      { name: "Mixed Veg Pickle", price: 25000 },
    ],
  },
  {
    slug: "meenas-tiffin",
    category: "food",
    displayName: "Meena's Tiffin",
    bio: "Home cooked tiffins",
    products: [
      { name: "Dal Rice Combo", price: 12000 },
      { name: "Paneer Thali", price: 15000 },
    ],
  },
];

function randomPassword(): string {
  // 24 random bytes -> url-safe string. Never logged, never reused.
  return nodeCrypto.randomBytes(24).toString("base64url");
}

async function findUserByEmail(email: string): Promise<string | null> {
  // Paginate through users (demo project is small).
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const match = data.users.find(
      (u: { id: string; email?: string }) =>
        (u.email || "").toLowerCase() === email.toLowerCase()
    );
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}

async function ensureAuthUser(email: string): Promise<string> {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: randomPassword(),
    email_confirm: true,
  });
  if (!error && data?.user) return data.user.id;

  // Already registered — reuse the existing user.
  const existing = await findUserByEmail(email);
  if (existing) return existing;

  throw error || new Error(`Could not create or find auth user for ${email}`);
}

async function seedStore(s: DemoStore): Promise<void> {
  const email = `${s.slug}@demo.mystorr.in`;
  const storeMode = s.category === "food" ? "menu" : "catalogue";

  // 1. Reuse an existing store row if the slug is already seeded.
  const { data: existing } = await admin
    .from("stores")
    .select("id, user_id")
    .eq("store_name", s.slug)
    .maybeSingle();

  const userId = existing?.user_id || (await ensureAuthUser(email));

  const storeRow = {
    user_id: userId,
    store_name: s.slug,
    display_name: s.displayName,
    bio: s.bio,
    profile_image_url: null,
    category: s.category,
    store_mode: storeMode,
    upi_id: "demo@okaxis",
    whatsapp_number: "919999999999",
    is_open: true,
    is_pro: false,
    instagram_handle: null,
  };

  let storeId: string;
  if (existing?.id) {
    const { error } = await admin
      .from("stores")
      .update(storeRow)
      .eq("id", existing.id);
    if (error) throw error;
    storeId = existing.id;
    // Replace previous demo products for a clean re-run.
    await admin.from("products").delete().eq("store_id", storeId);
  } else {
    const { data, error } = await admin
      .from("stores")
      .insert(storeRow)
      .select("id")
      .single();
    if (error) throw error;
    storeId = data.id;
  }

  // 2. Insert the two demo products (no images).
  const productRows = s.products.map((p, i) => ({
    store_id: storeId,
    name: p.name,
    price: p.price,
    image_url: null,
    quantity_available: -1,
    is_available: true,
    // Food store is menu-mode: "always_available" so dishes always show.
    category: storeMode === "menu" ? "always_available" : "todays_special",
    order_index: i,
  }));
  const { error: prodErr } = await admin.from("products").insert(productRows);
  if (prodErr) throw prodErr;

  console.log(
    `✓ ${s.displayName.padEnd(20)} /${s.slug.padEnd(18)} ` +
      `[${s.category}] ${s.products.length} products — ${
        existing ? "updated" : "created"
      }`
  );
}

async function main() {
  console.log("Seeding demo stores...\n");
  let ok = 0;
  for (const s of STORES) {
    try {
      await seedStore(s);
      ok++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${s.displayName}: ${msg}`);
    }
  }
  console.log(`\nDone. ${ok}/${STORES.length} demo stores seeded.`);
  if (ok < STORES.length) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
