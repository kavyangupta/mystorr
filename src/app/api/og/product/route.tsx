import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { appHost } from "@/lib/utils";

// Needs the Supabase admin client + full Intl for price grouping.
export const runtime = "nodejs";

// Same deterministic palette as <InitialsAvatar> so the share image matches
// the on-site placeholder when a product has no photo.
const PALETTE = [
  "#7C3AED",
  "#534AB7",
  "#DB2777",
  "#16A34A",
  "#EA580C",
  "#0891B2",
  "#CA8A04",
  "#9333EA",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// "Rs 1,80,000" — avoids the ₹ glyph (often missing in OG fallback fonts)
// while keeping Indian digit grouping.
function priceLabel(paise: number): string {
  const rupees = Math.round(paise) / 100;
  return `Rs ${rupees.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeSlug = searchParams.get("store") || "";
  const productId = searchParams.get("product") || "";

  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, price, image_url, store_id")
    .eq("id", productId)
    .maybeSingle();

  const { data: store } = await supabase
    .from("stores")
    .select("display_name, store_name")
    .eq("store_name", storeSlug)
    .maybeSingle();

  const name = product?.name || "Product";
  const price = typeof product?.price === "number" ? product.price : 0;
  const image = product?.image_url || null;
  const displayName = store?.display_name || "Mystorr shop";
  const linkLabel = `${appHost()}/${storeSlug}`;
  const color = PALETTE[hashString(name) % PALETTE.length];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          position: "relative",
          backgroundColor: color,
        }}
      >
        {/* Product photo or coloured initials fill */}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            width={1080}
            height={1920}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1080px",
              height: "1920px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1080px",
              height: "1920px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `linear-gradient(135deg, ${color}, #18181B)`,
              color: "white",
              fontSize: "400px",
              fontWeight: 800,
            }}
          >
            {getInitials(name)}
          </div>
        )}

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "48px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.92)",
            color: "#534AB7",
            fontSize: "40px",
            fontWeight: 800,
            padding: "14px 30px",
            borderRadius: "999px",
          }}
        >
          Mystorr
        </div>

        {/* Bottom gradient strip with name, price and link */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "1080px",
            height: "720px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "80px",
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "44px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              marginBottom: "16px",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "84px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 800,
              color: "#FBBF24",
              marginBottom: "40px",
            }}
          >
            {priceLabel(price)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              backgroundColor: "#534AB7",
              color: "white",
              fontSize: "40px",
              fontWeight: 700,
              padding: "20px 40px",
              borderRadius: "999px",
            }}
          >
            {linkLabel}
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
