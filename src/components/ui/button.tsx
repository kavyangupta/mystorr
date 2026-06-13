import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-4",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-ink/90",
        brand: "bg-brand text-white hover:bg-brand/90",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp/90",
        upi: "bg-upi text-white hover:bg-upi/90",
        outline: "border border-line bg-white text-ink hover:bg-background",
        ghost: "text-ink hover:bg-background",
      },
      size: {
        default: "min-h-[44px]",
        sm: "min-h-[36px] px-3 text-sm",
        xs: "min-h-[40px] px-3 text-xs",
        icon: "min-h-[44px] w-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
