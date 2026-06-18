import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Missing-photo placeholder shown wherever a product/store has no image.
 * A simple ImageOff glyph in the category accent colour on a light gray disc —
 * deliberately small and neat, never a full-bleed giant-initials rectangle.
 *
 * - `inset` (product image area): a light tinted frame fills the slot with a
 *   centred 64px gray circle inside it.
 * - default (profile circle / small thumbnail): the whole round parent becomes
 *   the gray disc with a centred icon.
 */
export function PhotoFallback({
  accent,
  tint,
  inset = false,
  className,
}: {
  accent: string;
  tint?: string;
  inset?: boolean;
  className?: string;
}) {
  if (inset) {
    return (
      <div
        aria-hidden
        className={cn("flex h-full w-full items-center justify-center", className)}
        style={{ backgroundColor: tint ?? "#F4F4F5" }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <ImageOff className="h-7 w-7" style={{ color: accent }} />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center bg-zinc-100",
        className
      )}
    >
      <ImageOff className="h-1/2 w-1/2" style={{ color: accent }} />
    </div>
  );
}
