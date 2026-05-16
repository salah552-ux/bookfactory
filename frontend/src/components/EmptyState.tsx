import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      {icon && (
        <div className="mb-4 size-12 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-display text-xl text-slate-200 mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-md mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
