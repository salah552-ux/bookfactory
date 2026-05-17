import { cn } from "@/lib/cn";

type Tone = "violet" | "cyan" | "green" | "orange" | "red" | "magenta";

export function StatCard({
  icon,
  value,
  label,
  tone,
  className,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <div className={cn("card px-4 py-3 flex items-center gap-3 min-w-0", className)}>
      <span className={cn("icon-tile", tone)}>{icon}</span>
      <div className="min-w-0">
        <div className="text-2xl font-semibold text-text-1 tnum leading-none">
          {value}
        </div>
        <div className="text-xs text-text-3 mt-1 truncate">{label}</div>
      </div>
    </div>
  );
}
