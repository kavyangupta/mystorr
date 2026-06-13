import { cn } from "@/lib/utils";

/**
 * Mystorr storefront mark — purple rounded square with a white awning
 * (purple / orange / purple scallops) and a bold white "M" forming the
 * shop pillars. Pure SVG so it stays crisp at any size.
 */
export function MystorrMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Mystorr"
    >
      <defs>
        <linearGradient id="ms-sq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C5CE6" />
          <stop offset="1" stopColor="#4F3FB0" />
        </linearGradient>
      </defs>

      {/* rounded square */}
      <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#ms-sq)" />

      {/* awning scallops */}
      <g stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M24 33 V41 A8 8 0 0 1 40 41 V33 Z" fill="#9B82F0" />
        <path d="M42 33 V41 A8 8 0 0 1 58 41 V33 Z" fill="#F97316" />
        <path d="M60 33 V41 A8 8 0 0 1 76 41 V33 Z" fill="#9B82F0" />
      </g>
      {/* roof bar */}
      <rect x="22" y="27" width="56" height="7.5" rx="3.75" fill="#ffffff" />

      {/* M */}
      <path
        d="M33 74 V52 L50 64 L67 52 V74"
        fill="none"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Full logo: mark + "mystorr.in" wordmark.
 * variant "light" renders the wordmark in white for dark backgrounds.
 */
export function MystorrLogo({
  className,
  variant = "default",
  showText = true,
}: {
  className?: string;
  variant?: "default" | "light";
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <MystorrMark className="h-8 w-8" />
      {showText && (
        <span className="text-xl font-extrabold lowercase tracking-tight">
          <span className={variant === "light" ? "text-white" : "text-brand"}>
            mystorr
          </span>
          <span className="text-[#F97316]">.in</span>
        </span>
      )}
    </span>
  );
}
