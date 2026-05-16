import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "secondary" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  default: cn(
    "text-white border border-brand-navy/60",
    "bg-gradient-to-b from-[#2b507a] to-[#1b3a5c]",
    "hover:from-[#345f8e] hover:to-[#23476f]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_1px_3px_rgba(0,0,0,0.35)]"
  ),
  secondary: cn(
    "border border-slate-700/70 text-slate-100",
    "bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600",
    "backdrop-blur-sm"
  ),
  ghost: cn(
    "border border-transparent text-slate-300",
    "hover:bg-slate-800/50 hover:text-slate-100"
  ),
  danger: cn(
    "text-white border border-red-900",
    "bg-gradient-to-b from-red-600 to-red-800",
    "hover:from-red-500 hover:to-red-700"
  ),
  gold: cn(
    "text-[#1a1306] border border-[#a98c3c]",
    "bg-gradient-to-b from-[#e9d8a1] via-[#d4af37] to-[#a98c3c]",
    "hover:from-[#f0deaa] hover:via-[#dcb53f] hover:to-[#b39440]",
    "shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]"
  ),
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-[15px] gap-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium tracking-tight",
        "transition-[background,border-color,box-shadow,transform] duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tan/60",
        "active:translate-y-px",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
