import { cn } from "@/lib/utils";

// Deterministic, pleasant palette — same name always gets the same colour.
const PALETTE = [
  "#7C3AED", // violet
  "#534AB7", // brand indigo
  "#DB2777", // pink
  "#16A34A", // green
  "#EA580C", // orange
  "#0891B2", // cyan
  "#CA8A04", // amber
  "#9333EA", // purple
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

/**
 * Coloured initials placeholder shown wherever a real photo is missing,
 * instead of a broken/empty image. Fills its (rounded) parent, so inside a
 * round container it renders as a coloured circle.
 */
export function InitialsAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const color = PALETTE[hashString(name) % PALETTE.length];
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center font-extrabold uppercase tracking-tight text-white",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${color}, ${color}cc)`,
      }}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}
