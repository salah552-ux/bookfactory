import { cn } from "@/lib/cn";

/**
 * Premium page header — eyebrow + display title + lede subtitle + optional
 * right-aligned action cluster. Used across every top-level route for
 * consistent hierarchy.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-slate-800/50",
        className
      )}
    >
      <div className="space-y-2 min-w-0">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="text-display text-4xl sm:text-5xl text-slate-100 truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-400 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
