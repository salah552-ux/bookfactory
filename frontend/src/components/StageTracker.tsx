import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const STAGES: Array<{ id: string; label: string; fullId: string }> = [
  { id: "01", label: "Research", fullId: "01-research" },
  { id: "02", label: "Planning", fullId: "02-planning" },
  { id: "03", label: "Writing", fullId: "03-writing" },
  { id: "04", label: "Quality", fullId: "04-quality" },
  { id: "05", label: "Optimisation", fullId: "05-optimisation" },
  { id: "06", label: "Production", fullId: "06-production" },
  { id: "07", label: "Publishing", fullId: "07-publishing" },
  { id: "08", label: "Products", fullId: "08-products" },
  { id: "09", label: "Series", fullId: "09-series" },
  { id: "10", label: "Post-launch", fullId: "10-postlaunch" },
];

/**
 * Read a pipeline-state.json object and return which stages are complete /
 * in progress / pending. The schema isn't fully nailed down so we sniff for
 * common patterns: stage.complete, stage.status, *_approved flags.
 */
function statusFor(state: unknown, stageId: string): "done" | "active" | "todo" {
  if (!state || typeof state !== "object") return "todo";
  const s = state as Record<string, unknown>;
  const stages = (s.stages as Record<string, unknown> | undefined) ?? {};
  const node = stages[stageId] as Record<string, unknown> | undefined;
  if (node) {
    if (node.complete === true || node.status === "done") return "done";
    if (node.status === "in_progress" || node.in_progress === true) return "active";
  }
  if ((s.current_stage as string | undefined) === stageId) return "active";
  return "todo";
}

export function StageTracker({
  state,
  bookSlug,
  className,
}: {
  state: unknown;
  bookSlug?: string;
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap gap-1", className)}>
      {STAGES.map((stage) => {
        const status = statusFor(state, stage.id);
        const cls = cn(
          "flex flex-col items-center px-2 py-1 rounded text-[10px] min-w-[64px] transition-colors",
          status === "done" && "bg-emerald-900/40 text-emerald-300",
          status === "active" && "bg-amber-900/40 text-amber-300",
          status === "todo" && "bg-slate-800/60 text-slate-500",
          bookSlug && "hover:bg-slate-700/60 hover:text-slate-100"
        );
        const body = (
          <>
            <span className="font-mono">{stage.id}</span>
            <span className="tracking-tight">{stage.label}</span>
          </>
        );
        return (
          <li key={stage.id}>
            {bookSlug ? (
              <Link
                to={`/books/${bookSlug}/stage/${stage.fullId}`}
                className={cls}
              >
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
