import { cn } from "@/lib/cn";

/**
 * Render a book-reviewer score against the 120-point rubric. Threshold for
 * chapter approval is 96/120 per CLAUDE.md.
 */
export function ScoreBadge({
  score,
  max = 120,
  threshold = 96,
  size = "md",
  className,
}: {
  score: number | null | undefined;
  max?: number;
  threshold?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (score == null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-slate-800 text-slate-500",
          size === "sm" && "px-2 py-0.5 text-[10px]",
          size === "md" && "px-2.5 py-0.5 text-xs",
          size === "lg" && "px-3 py-1 text-sm",
          className
        )}
      >
        —/{max}
      </span>
    );
  }

  const tier =
    score >= threshold + 12
      ? "A"
      : score >= threshold
        ? "B"
        : score >= threshold - 12
          ? "C"
          : "F";

  const tierColours: Record<typeof tier, string> = {
    A: "bg-emerald-900/50 text-emerald-300 border-emerald-700/60",
    B: "bg-emerald-900/30 text-emerald-300 border-emerald-700/40",
    C: "bg-amber-900/40 text-amber-300 border-amber-700/50",
    F: "bg-red-900/50 text-red-300 border-red-700/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono",
        tierColours[tier],
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-0.5 text-xs",
        size === "lg" && "px-3 py-1 text-sm",
        className
      )}
      title={`book-reviewer score · pass at ${threshold}/${max}`}
    >
      <span className="font-bold">{tier}</span>
      <span>
        {score}/{max}
      </span>
    </span>
  );
}
