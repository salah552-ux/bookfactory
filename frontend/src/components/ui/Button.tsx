import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

/**
 * Flat, low-chrome buttons. No gradients. Subtle border + bg-on-hover.
 * Inspired by Linear / Vercel button system.
 */
const variants: Record<Variant, string> = {
  primary: cn(
    "bg-text-1 text-bg border border-text-1",
    "hover:bg-text-2 hover:border-text-2",
    "active:opacity-90"
  ),
  secondary: cn(
    "bg-raised text-text-1 border border-line-2",
    "hover:bg-surface hover:border-text-3"
  ),
  ghost: cn(
    "bg-transparent text-text-2 border border-transparent",
    "hover:bg-raised hover:text-text-1"
  ),
  danger: cn(
    "bg-err/10 text-err border border-err/40",
    "hover:bg-err/20 hover:border-err/60"
  ),
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5",
  md: "h-8 px-3 text-sm gap-1.5",
  lg: "h-9 px-4 text-md gap-2",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

/** Pill / chip — for stage chips, tags, status indicators. */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "warn" | "err" | "accent";
  className?: string;
}) {
  const tones = {
    neutral: "bg-raised text-text-2 border-line",
    ok:      "bg-ok/10 text-ok border-ok/30",
    warn:    "bg-warn/10 text-warn border-warn/30",
    err:     "bg-err/10 text-err border-err/30",
    accent:  "bg-accent-soft text-accent border-accent/30",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
