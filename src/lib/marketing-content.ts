// Shared marketing copy for the homepage and /how-it-works.
// Centralised so routes never drift out of sync.

import type { StoreCategory } from "@/lib/types";

export type Lang = "en" | "hi";

// ---------------------------------------------------------------------------
// Templates — live demo shops shown in the "Choose your template" gallery.
// `slug` points at a real storefront; `category` is passed to /login so
// onboarding can pre-select it. `name`/`emoji` are fallbacks used until the
// real demo store (and its photo) loads.
// ---------------------------------------------------------------------------
export type Template = {
  category: StoreCategory;
  slug: string;
  label: string;
  emoji: string;
  name: string;
  tagline: string;
};

export const TEMPLATES: Template[] = [
  {
    category: "jewellery",
    slug: "riyas-jewellery",
    label: "Jewellery & accessories",
    emoji: "💍",
    name: "Riya's Jewellery",
    tagline: "Handmade with love ✨",
  },
  {
    category: "clothing",
    slug: "sanas-clothing",
    label: "Clothing & fashion",
    emoji: "👗",
    name: "Sana's Clothing",
    tagline: "Everyday & festive wear",
  },
  {
    category: "homemade",
    slug: "sunitas-pickles",
    label: "Homemade products",
    emoji: "🏺",
    name: "Sunita's Pickles",
    tagline: "Homemade & fresh",
  },
  {
    category: "food",
    slug: "meenas-tiffin",
    label: "Daily menu / food",
    emoji: "🍱",
    name: "Meena's Tiffin",
    tagline: "Fresh tiffins daily",
  },
];

// ---------------------------------------------------------------------------
// Hero (bilingual)
// ---------------------------------------------------------------------------
export const HERO = {
  badge: "🇮🇳 Built for Indian sellers",
  headline: {
    en: "Your products. One link. Everywhere.",
    hi: "आपके products। एक link। हर जगह।",
  },
  sub: {
    en: "Stop explaining your products in every DM. Create a beautiful shop link in 10 minutes. Share it on WhatsApp, Instagram bio, society groups. Customers browse everything and order instantly.",
    hi: "हर DM में photos भेजना बंद करो। एक beautiful shop link बनाओ और सबको share करो।",
  },
  cta: {
    en: "Create your free shop — it's free →",
    hi: "अपनी free shop बनाओ →",
  },
  secondaryCta: { en: "See how it works", hi: "कैसे काम करता है" },
  trust: [
    "No app needed",
    "Works on any phone",
    "Free forever",
    "Your money goes direct to your UPI",
  ],
};

// ---------------------------------------------------------------------------
// Pain points (bilingual single-line cards)
// ---------------------------------------------------------------------------
export type PainPoint = {
  emoji: string;
  en: string;
  hi: string;
};

export const PAIN_POINTS: PainPoint[] = [
  {
    emoji: "😩",
    en: "Sending the same product photos and prices to 20 different customers every day",
    hi: "रोज़ 20 लोगों को same photos और prices भेजना",
  },
  {
    emoji: "📱",
    en: "Your best products buried under 500 old WhatsApp messages and Instagram posts",
    hi: "Best products पुराने messages में दब जाते हैं",
  },
  {
    emoji: "💸",
    en: "Customers asking 'kya hai tumhare paas?' when everything is right there in your old posts",
    hi: "Customers पूछते हैं 'क्या है?' जब सब कुछ वहीं है",
  },
];

// ---------------------------------------------------------------------------
// Trust badges
// ---------------------------------------------------------------------------
export type TrustBadge = { emoji: string; text: string };

export const TRUST_BADGES: TrustBadge[] = [
  { emoji: "🔒", text: "Your money goes direct to your UPI — we never touch it" },
  { emoji: "📱", text: "Works on any Android or iPhone — no app download" },
  { emoji: "🇮🇳", text: "Made in India for Indian sellers" },
  { emoji: "⚡", text: "Free forever — no hidden charges ever" },
];

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------
export type Step = {
  number: string;
  title: string;
  body: string;
  detail: string;
};

export const STEPS: Step[] = [
  {
    number: "1",
    title: "Create your free shop",
    body: "Sign up, add your shop name and photo. Takes 2 minutes.",
    detail:
      "Sign in with Google, pick your shop link and add a name and photo. Your shop is live at mystorr.vercel.app/yourname before your chai goes cold.",
  },
  {
    number: "2",
    title: "Add your products",
    body: "Upload photos, set prices. Your permanent catalogue is ready.",
    detail:
      "Snap a photo, set a price, done. Mark items sold out and update from your phone anytime. Your catalogue stays organised — never buried in chat again.",
  },
  {
    number: "3",
    title: "Share one link everywhere",
    body: "Put it in your Instagram bio, WhatsApp bio, society group. Done.",
    detail:
      "One link for Instagram, WhatsApp status and every family group. Customers browse everything and pay you directly via UPI — organised, confirmed, tracked.",
  },
];

// ---------------------------------------------------------------------------
// Who it's for
// ---------------------------------------------------------------------------
export type Audience = {
  emoji: string;
  title: string;
  body: string;
};

export const AUDIENCE: Audience[] = [
  {
    emoji: "💍",
    title: "Jewellery & accessories",
    body: "Show every piece in a clean gallery customers can shop in seconds.",
  },
  {
    emoji: "👗",
    title: "Clothing, sarees & fashion",
    body: "Drop new collections with one link your followers can shop instantly.",
  },
  {
    emoji: "🏠",
    title: "Homemade products",
    body: "Pickles, candles, skincare, snacks — anything you make, beautifully listed.",
  },
  {
    emoji: "🍱",
    title: "Home chefs & tiffin",
    body: "Post today's menu and take pre-orders with a special daily menu mode.",
  },
];

// ---------------------------------------------------------------------------
// Features (used on /how-it-works recap)
// ---------------------------------------------------------------------------
export type Feature = {
  emoji: string;
  title: string;
  body: string;
};

export const FEATURES: Feature[] = [
  {
    emoji: "⚡",
    title: "Ready in 10 minutes",
    body: "From sign-in to a shareable shop link before your chai goes cold.",
  },
  {
    emoji: "💸",
    title: "UPI, direct to you",
    body: "Customers pay to your UPI ID — organised, confirmed, tracked. No middleman, no commission.",
  },
  {
    emoji: "🖼️",
    title: "A beautiful catalogue",
    body: "Every product in a clean gallery instead of buried under old chats.",
  },
  {
    emoji: "🍱",
    title: "Daily menu mode",
    body: "Built for kitchens — today's specials, ordering hours and sold-out tags.",
  },
  {
    emoji: "📊",
    title: "Order dashboard",
    body: "See every order coming in and keep track without a single spreadsheet.",
  },
  {
    emoji: "🔗",
    title: "Share anywhere",
    body: "One link for Instagram, WhatsApp status, and every family group.",
  },
  {
    emoji: "✍️",
    title: "Never write a product description again",
    body: "Type a few words about what you're selling, Mystorr writes the rest — sounds like you, not a robot.",
  },
  {
    emoji: "📸",
    title: "Make any phone photo look like a real shop",
    body: "Pick a backdrop style and your products instantly look styled — no camera, no editing skills needed.",
  },
];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  emoji: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Pehle roz 45 minute DM mein orders lete the. Ab society group mein link share kiya aur orders khud aate hain.",
    name: "Meena K.",
    location: "Delhi",
    emoji: "🍛",
  },
  {
    quote:
      "Meri jewellery ab ek jagah dikhti hai. Customers khud dekh ke order karte hain.",
    name: "Priya S.",
    location: "Mumbai",
    emoji: "💍",
  },
  {
    quote:
      "10 minute mein shop ready ho gayi. Customers ko link bheja aur same din 3 orders aaye.",
    name: "Sunita R.",
    location: "Bangalore",
    emoji: "🍪",
  },
];
