"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// A cluster of happy potential customers — a home chef, an Insta seller,
// a jewellery maker, a boutique owner and a home baker. Each bubble pops in
// on load and then bobs gently for a lively, welcoming feel.
const CUSTOMERS = [
  { emoji: "👨‍🍳", label: "Home chef", bg: "from-orange-200 to-amber-300" },
  { emoji: "📸", label: "Insta seller", bg: "from-pink-200 to-rose-300" },
  { emoji: "💍", label: "Jewellery maker", bg: "from-purple-200 to-violet-300" },
  { emoji: "👗", label: "Boutique owner", bg: "from-fuchsia-200 to-pink-300" },
  { emoji: "🧁", label: "Home baker", bg: "from-rose-200 to-orange-200" },
];

export function CustomerAvatars({ className }: { className?: string }) {
  return (
    <div className={cn("hidden items-center lg:flex", className)} aria-hidden>
      {CUSTOMERS.map((c, i) => (
        <motion.div
          key={c.label}
          title={c.label}
          className={cn(i > 0 && "-ml-2")}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35 + i * 0.1, type: "spring", stiffness: 280, damping: 16 }}
          style={{ zIndex: CUSTOMERS.length - i }}
        >
          <motion.div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-base shadow-sm ring-2 ring-white",
              c.bg
            )}
            animate={{ y: [0, -3.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
          >
            <span className="leading-none">{c.emoji}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
