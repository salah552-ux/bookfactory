import { cn } from "@/lib/cn";

/**
 * Linear-style page header. Compact, no eyebrow micro-text by default —
 * the page title carries the hierarchy on its own. Actions sit to the right.
 */
export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Small monospace meta line above the title — e.g. breadcrumb or slug. */
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-1 min-w-0">
        {meta && (
          <div className="text-xs font-mono text-text-4 truncate">{meta}</div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-text-1 truncate">
          {title}
        </h1>
        {description && (
          <p className="text-md text-text-3 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
