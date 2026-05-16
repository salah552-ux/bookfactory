import * as React from "react";
import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  flat?: boolean;
}

export function Card({ className, hoverable, flat, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-line",
        flat ? "bg-transparent" : "bg-surface",
        hoverable && "transition-colors duration-150 hover:bg-raised hover:border-line-2 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-line",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-md font-semibold tracking-tight text-text-1",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

/**
 * Section header for a flat (non-card) block. Use this for stage agents,
 * filter lists, etc. — anything that's a heading + content, not a contained
 * widget. Inspired by Linear's section heads.
 */
export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4 pb-3", className)}>
      <div>
        <h2 className="text-md font-semibold text-text-1 tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-text-3 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
