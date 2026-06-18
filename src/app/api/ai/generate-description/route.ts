import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Per-store free quota for the AI product-description writer.
const MONTHLY_LIMIT = 10;
const MODEL = "gemini-2.5-flash-lite";

// First day of next month (UTC) — when the seller's quota rolls over.
function firstOfNextMonth(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

// "1 July 2026" — friendly reset date for the limit message.
function formatResetDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function POST(request: Request) {
  // 1) Authenticate the seller.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Validate input.
  let phrase = "";
  try {
    const body = await request.json();
    phrase = typeof body?.phrase === "string" ? body.phrase.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!phrase) {
    return NextResponse.json(
      { error: "Type a few words about your product first." },
      { status: 400 }
    );
  }
  if (phrase.length > 120) phrase = phrase.slice(0, 120);

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured right now." },
      { status: 500 }
    );
  }

  // 3) Find the seller's store (admin client — usage bookkeeping is server-only).
  const admin = createAdminClient();
  const { data: store, error: storeErr } = await admin
    .from("stores")
    .select("id, ai_generations_used, ai_generations_reset")
    .eq("user_id", user.id)
    .maybeSingle();
  if (storeErr || !store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  // 4) Roll the quota over if we've passed the stored reset date.
  const now = new Date();
  const nextReset = firstOfNextMonth(now);
  let used = store.ai_generations_used ?? 0;
  let resetDate = store.ai_generations_reset
    ? new Date(`${store.ai_generations_reset}T00:00:00Z`)
    : null;

  if (!resetDate || now >= resetDate) {
    used = 0;
    resetDate = nextReset;
  }

  // 5) Enforce the cap — no API call once exhausted.
  if (used >= MONTHLY_LIMIT) {
    return NextResponse.json(
      {
        error: "limit_reached",
        message: `You've used all ${MONTHLY_LIMIT} free AI descriptions for this month. Your free generations refresh on ${formatResetDate(
          resetDate
        )}.`,
        resetDate: formatResetDate(resetDate),
        remaining: 0,
      },
      { status: 429 }
    );
  }

  // 6) Build the prompt and call Gemini.
  const prompt = `You write product descriptions for small Indian home sellers (home cooks, jewellery makers, clothing and homemade-goods sellers) who sell to friends, family and neighbours.

The seller has typed this short phrase about their product:
"${phrase}"

Write a warm, simple, inviting product description that expands their phrase. Rules:
- 2 to 3 short sentences only.
- Friendly, everyday language an Indian seller would actually use — not corporate or robotic.
- Make it sound personal and hand-made, never exaggerated or full of marketing buzzwords.
- Do not invent specific prices, weights, delivery times or ingredients that were not implied.
- Plain text only: no markdown, no quotes around the text, no emojis, no headings.
Return only the description text.`;

  let aiText = "";
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Couldn't generate right now. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    aiText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p?.text || "")
        .join("")
        .trim() || "";
  } catch {
    return NextResponse.json(
      { error: "Couldn't generate right now. Please try again." },
      { status: 502 }
    );
  }

  if (!aiText) {
    return NextResponse.json(
      { error: "Couldn't generate right now. Please try again." },
      { status: 502 }
    );
  }

  // Tidy: strip any wrapping quotes / stray markdown the model may add.
  aiText = aiText.replace(/^["'`]+|["'`]+$/g, "").trim();

  // 7) Count this successful generation.
  const newUsed = used + 1;
  await admin
    .from("stores")
    .update({
      ai_generations_used: newUsed,
      ai_generations_reset: resetDate.toISOString().slice(0, 10),
    })
    .eq("id", store.id);

  return NextResponse.json({
    description: aiText,
    remaining: Math.max(0, MONTHLY_LIMIT - newUsed),
    resetDate: formatResetDate(resetDate),
  });
}
