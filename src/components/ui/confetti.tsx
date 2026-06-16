"use client";

import * as React from "react";

const COLORS = ["#534AB7", "#7C3AED", "#F97316", "#16A34A", "#FBBF24", "#EC4899"];

// Lightweight CSS confetti burst — no dependency. Renders a fixed set of
// pieces with randomised colour, position, delay and duration that fall once.
export function Confetti({ pieces = 80 }: { pieces?: number }) {
  const bits = React.useMemo(
    () =>
      Array.from({ length: pieces }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    [pieces]
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.id}
          className="confetti-piece"
          style={{
            left: `${b.left}%`,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            transform: `rotate(${b.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
