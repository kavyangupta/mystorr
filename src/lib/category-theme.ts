// Category visual identity for the public storefronts — the same palette used
// on the homepage "Choose your template" cards, so a seller's live shop matches
// the template they picked.
//
// `categoryTheme` covers the three catalogue categories that get a tint/accent
// pass (jewellery, clothing, homemade). Food/daily-menu has its own booklet
// theme and legacy null-category stores stay neutral, so both return null here.
//
// `placeholderTheme` is defined for EVERY category (incl. food + legacy) because
// the missing-photo placeholder is applied storefront-wide.

export type CatTheme = {
  /** Header section background tint. */
  tint: string;
  /** Accent for the UPI button, price, status badge, profile ring. */
  accent: string;
  /** Product-card corner rounding (homemade is a touch rounder). */
  rounded: string;
};

const THEMES: Record<string, CatTheme> = {
  jewellery: { tint: "#FAEEDA", accent: "#854F0B", rounded: "rounded-card" },
  clothing: { tint: "#F1EFE8", accent: "#534AB7", rounded: "rounded-card" },
  homemade: { tint: "#FAECE7", accent: "#993C1D", rounded: "rounded-2xl" },
};

export function categoryTheme(category?: string | null): CatTheme | null {
  if (!category) return null;
  return THEMES[category] ?? null;
}

// Accent (icon) + light frame tint for the missing-photo placeholder.
const PLACEHOLDER: Record<string, { accent: string; tint: string }> = {
  jewellery: { accent: "#854F0B", tint: "#FAEEDA" },
  clothing: { accent: "#534AB7", tint: "#F1EFE8" },
  homemade: { accent: "#993C1D", tint: "#FAECE7" },
  food: { accent: "#B45309", tint: "#FFF7E6" },
};

const PLACEHOLDER_DEFAULT = { accent: "#71717A", tint: "#F4F4F5" };

export function placeholderTheme(category?: string | null) {
  if (!category) return PLACEHOLDER_DEFAULT;
  return PLACEHOLDER[category] ?? PLACEHOLDER_DEFAULT;
}
