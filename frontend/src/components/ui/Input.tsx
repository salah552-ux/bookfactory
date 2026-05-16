import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-8 w-full rounded-md border border-line bg-surface px-2.5 text-sm",
        "text-text-1 placeholder:text-text-4",
        "transition-colors duration-150",
        "hover:border-line-2",
        "focus:outline-none focus:border-accent/60 focus:bg-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-line bg-surface px-2.5 py-2 text-sm",
        "text-text-1 placeholder:text-text-4",
        "transition-colors duration-150",
        "hover:border-line-2",
        "focus:outline-none focus:border-accent/60 focus:bg-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
