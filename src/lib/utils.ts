import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProductCategory, Store } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APP_NAME = "MYSTORR";

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://mystorr.in";
}

export function appHost() {
  return appUrl().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** paise -> "₹1,299" (en-IN grouping, no decimals) */
export function formatPrice(paise: number): string {
  const rupees = Math.round(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** rupees number -> paise integer */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/** paise -> plain rupees number (for UPI am= field) */
export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

/** Slug rules: lowercase letters, numbers, hyphens; max 30 chars. */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 30);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{1,30}$/.test(slug);
}

/** Accepts a 10-digit Indian mobile (optionally already 91-prefixed). */
export function normalizeWhatsApp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91") && /^91[6-9]/.test(digits))
    return digits;
  return null;
}

export function isValidUpi(upi: string): boolean {
  return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi.trim());
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function todayLabel(date = new Date()): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function whatsappOrderLink(opts: {
  whatsapp: string;
  productName: string;
  price: number; // paise
  displayName: string;
}): string {
  const text = `Hi! I want to order ${opts.productName} for ${formatPrice(
    opts.price
  )} from ${opts.displayName}. Is it available?`;
  return `https://wa.me/${opts.whatsapp}?text=${encodeURIComponent(text)}`;
}

// ---------------------------------------------------------------------------
// Daily Menu mode helpers
// ---------------------------------------------------------------------------

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; emoji: string; hint: string }
> = {
  todays_special: {
    label: "Today's Special",
    emoji: "⭐",
    hint: "Made fresh today — only available today",
  },
  always_available: {
    label: "Always Available",
    emoji: "🍱",
    hint: "On your menu every day",
  },
  weekly_special: {
    label: "Weekly Special",
    emoji: "📅",
    hint: "Available on one fixed day each week",
  },
  festival_special: {
    label: "Festival Special",
    emoji: "🎉",
    hint: "For a festival or limited season",
  },
  preorder: {
    label: "Pre-order Only",
    emoji: "📞",
    hint: "Made to order — customers enquire ahead",
  },
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "todays_special",
  "weekly_special",
  "festival_special",
  "always_available",
  "preorder",
];

export const DIETARY_TAGS = [
  "Veg",
  "Jain",
  "Contains dairy",
  "Contains nuts",
  "Gluten free",
] as const;

export const SERVES_OPTIONS: { value: string; label: string }[] = [
  { value: "1", label: "Serves 1" },
  { value: "2", label: "Serves 2" },
  { value: "4", label: "Serves 4" },
  { value: "family", label: "Family pack" },
];

export function servesLabel(serves: string | null): string | null {
  if (!serves) return null;
  return SERVES_OPTIONS.find((s) => s.value === serves)?.label ?? `Serves ${serves}`;
}

/** Convert 'HH:MM' to a friendly '8:00 AM'. Returns null for empty input. */
export function formatTime(hhmm: string | null): string | null {
  if (!hhmm) return null;
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

/** A Date whose local fields represent the current time in IST (Asia/Kolkata). */
export function istNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

export type OrderingState = "open" | "closed" | "holiday";

export type OrderingStatus = {
  state: OrderingState;
  message: string; // short status line
  detail: string | null; // secondary line (hours / return date / next-open)
};

/** Minutes since midnight for 'HH:MM'. */
function minutesOf(hhmm: string): number | null {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * Derive the live ordering status for a menu-mode store.
 * Priority: holiday > manual closed (is_open) > day-of-week > ordering-hours window.
 */
export function getOrderingStatus(store: Store, now = new Date()): OrderingStatus {
  // 1. Holiday mode
  if (store.holiday_mode) {
    const back = store.holiday_return_date
      ? new Date(store.holiday_return_date + "T00:00:00")
      : null;
    return {
      state: "holiday",
      message: "On a short break",
      detail:
        back && !Number.isNaN(back.getTime())
          ? `Back on ${back.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}`
          : "Back soon",
    };
  }

  // 2. Manual closed switch
  if (!store.is_open) {
    return { state: "closed", message: "Closed right now", detail: null };
  }

  const days =
    Array.isArray(store.operating_days) && store.operating_days.length
      ? store.operating_days
      : [0, 1, 2, 3, 4, 5, 6];
  const today = now.getDay();

  // 3. Not an operating day
  if (!days.includes(today)) {
    const next = nextOperatingDay(days, today);
    return {
      state: "closed",
      message: "Closed today",
      detail: next != null ? `Open again on ${DAY_NAMES[next]}` : null,
    };
  }

  // 4. Ordering-hours window
  if (store.order_start_time && store.order_end_time) {
    const start = minutesOf(store.order_start_time);
    const end = minutesOf(store.order_end_time);
    const cur = now.getHours() * 60 + now.getMinutes();
    if (start != null && end != null) {
      const windowLabel = `${formatTime(store.order_start_time)} – ${formatTime(
        store.order_end_time
      )}`;
      if (cur < start) {
        return {
          state: "closed",
          message: "Orders open soon",
          detail: `Today from ${formatTime(store.order_start_time)}`,
        };
      }
      if (cur > end) {
        return {
          state: "closed",
          message: "Orders closed for today",
          detail: `Open tomorrow ${formatTime(store.order_start_time)}`,
        };
      }
      return {
        state: "open",
        message: "Taking orders now",
        detail: windowLabel,
      };
    }
  }

  // 5. Open with no specific hours
  return { state: "open", message: "Taking orders now", detail: null };
}

function nextOperatingDay(days: number[], today: number): number | null {
  for (let i = 1; i <= 7; i++) {
    const d = (today + i) % 7;
    if (days.includes(d)) return d;
  }
  return null;
}

/** Whole-day countdown to a deadline date (YYYY-MM-DD). */
export function daysUntil(dateStr: string | null, now = new Date()): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T23:59:59");
  if (Number.isNaN(target.getTime())) return null;
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function countdownLabel(dateStr: string | null, now = new Date()): string | null {
  const d = daysUntil(dateStr, now);
  if (d == null) return null;
  if (d < 0) return "Ended";
  if (d === 0) return "Last day!";
  if (d === 1) return "1 day left";
  return `${d} days left`;
}

/** Build a pre-filled WhatsApp order message for a menu item. */
export function whatsappMenuOrderLink(opts: {
  whatsapp: string;
  productName: string;
  price: number; // paise
  quantity: number;
  displayName: string;
  preorder?: boolean;
}): string {
  const total = opts.price * opts.quantity;
  const text = opts.preorder
    ? `Hi ${opts.displayName}! I'd like to pre-order ${opts.productName}. When can I get it?`
    : `Hi ${opts.displayName}! I'd like to order:\n\n${opts.quantity} × ${
        opts.productName
      } — ${formatPrice(total)}\n\nIs this available?`;
  return `https://wa.me/${opts.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function whatsappChatLink(whatsapp: string): string {
  return `https://wa.me/${whatsapp}`;
}

export function upiPayLink(opts: {
  upiId: string;
  displayName: string;
  price: number; // paise
}): string {
  const amount = paiseToRupees(opts.price).toFixed(2);
  const params = new URLSearchParams({
    pa: opts.upiId,
    pn: opts.displayName,
    am: amount,
    cu: "INR",
    tn: `Order from ${opts.displayName}`,
  });
  return `upi://pay?${params.toString()}`;
}
