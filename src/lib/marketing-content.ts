// Shared marketing copy for the homepage, /how-it-works and /pricing.
// Centralised so the three routes never drift out of sync.

export type PainPoint = {
  emoji: string;
  title: string;
  body: string;
};

export const PAIN_POINTS: PainPoint[] = [
  {
    emoji: "😩",
    title: "45 minutes a day lost in DMs",
    body: "Repeating prices, sharing the same photos, copying addresses — all by hand, every single order.",
  },
  {
    emoji: "📱",
    title: "Customers can't find last week's products",
    body: "Your catalogue is buried under 200 WhatsApp messages. People give up before they buy.",
  },
  {
    emoji: "💸",
    title: "Manually matching UPI payments",
    body: "Scrolling your bank app, cross-checking screenshots, hoping nobody forgot to pay.",
  },
];

export type Step = {
  number: string;
  title: string;
  body: string;
  detail: string;
};

export const STEPS: Step[] = [
  {
    number: "1",
    title: "Create your shop",
    body: "Sign in with Google and pick your shop link. No app to download, nothing to install.",
    detail:
      "Add your name, photo, bio and WhatsApp number. Your shop is live at mystorr.in/yourname in under two minutes.",
  },
  {
    number: "2",
    title: "Add your products",
    body: "Snap a photo, set a price, done. Run a fixed catalogue or a fresh daily menu.",
    detail:
      "Mark items sold out, set today's specials, add dietary tags and prep times. Update from your phone whenever you like.",
  },
  {
    number: "3",
    title: "Share your one link",
    body: "Drop it in your Instagram bio, WhatsApp status, or family group. Orders come straight to you.",
    detail:
      "Customers browse, tap Order, and reach you on WhatsApp with the item pre-filled. UPI payment links are built in.",
  },
];

export type Audience = {
  emoji: string;
  title: string;
  body: string;
};

export const AUDIENCE: Audience[] = [
  {
    emoji: "🍱",
    title: "Home chefs & tiffin services",
    body: "Post today's menu, take pre-orders, close ordering at your cut-off time.",
  },
  {
    emoji: "💍",
    title: "Jewellery makers",
    body: "Show every piece in a clean gallery instead of a messy photo dump.",
  },
  {
    emoji: "👗",
    title: "Clothing & boutiques",
    body: "Drop new collections with one link your followers can shop instantly.",
  },
  {
    emoji: "🏠",
    title: "Homemade products",
    body: "Candles, pickles, art, crafts — anything you make, beautifully listed.",
  },
];

export type Feature = {
  emoji: string;
  title: string;
  body: string;
};

export const FEATURES: Feature[] = [
  {
    emoji: "⚡",
    title: "Ready in 10 minutes",
    body: "From sign-in to shareable shop link before your chai goes cold.",
  },
  {
    emoji: "🍱",
    title: "Daily menu mode",
    body: "Built for kitchens — today's specials, ordering hours and sold-out tags.",
  },
  {
    emoji: "💸",
    title: "UPI, direct to you",
    body: "Customers pay to your UPI ID. No middleman, no commission cut.",
  },
  {
    emoji: "💬",
    title: "WhatsApp ordering",
    body: "Every order lands in your chat with the item and price pre-filled.",
  },
  {
    emoji: "📊",
    title: "Order dashboard",
    body: "See what's coming in and keep track without a single spreadsheet.",
  },
  {
    emoji: "🔗",
    title: "Share anywhere",
    body: "One link for Instagram, WhatsApp status, and every family group.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  emoji: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I used to spend my whole evening replying to the same questions. Now I just share my link and the orders come in while I cook.",
    name: "Meena K.",
    location: "Tiffin service, Delhi",
    emoji: "🍛",
  },
  {
    quote:
      "My jewellery finally looks professional. Customers scroll the whole collection and message me only when they're ready to buy.",
    name: "Priya S.",
    location: "Jewellery maker, Mumbai",
    emoji: "💍",
  },
  {
    quote:
      "Setup took ten minutes and it was free. I got three orders the same day I put the link on my status.",
    name: "Sunita R.",
    location: "Homemade snacks, Bangalore",
    emoji: "🍪",
  },
];

export type PricingTier = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
  note: string;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free Forever",
    price: "₹0",
    period: "",
    tagline: "Everything you need to start selling today.",
    features: [
      "Up to 8 products",
      "Your own shop link",
      "WhatsApp ordering",
      "UPI payment links",
      "Daily menu mode",
    ],
    cta: "Create your free shop",
    highlight: false,
    note: "No credit card needed",
  },
  {
    name: "Pro",
    price: "₹299",
    period: "/month",
    tagline: "For sellers ready to grow without limits.",
    features: [
      "Unlimited products",
      "Everything in Free",
      "Priority support",
      "Advanced menu scheduling",
      "Remove Mystorr branding",
    ],
    cta: "Go Pro",
    highlight: true,
    note: "Cancel anytime",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is it really free?",
    answer:
      "Yes. The Free Forever plan lets you list up to 8 products, take WhatsApp orders and share UPI payment links — with no credit card and no time limit. Upgrade to Pro only when you want unlimited products.",
  },
  {
    question: "Do my customers need to download anything?",
    answer:
      "No. Your shop is just a web link. Customers tap it, browse your products, and order through WhatsApp — no app, no sign-up, nothing to install.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Payments go straight to your own UPI ID. Mystorr generates the payment link, but the money lands directly in your account — we never touch it and take no commission.",
  },
  {
    question: "What is daily menu mode?",
    answer:
      "It's a special layout for kitchens and tiffin services. You can post today's specials, set ordering hours, mark items sold out, and add prep times or dietary tags — perfect for food that changes every day.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Your shop lives at mystorr.in/yourname for free. Custom domains are on our roadmap for Pro sellers — reach out and we'll keep you posted.",
  },
];
