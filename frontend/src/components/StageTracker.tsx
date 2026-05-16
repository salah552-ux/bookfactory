import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: "01", label: "Research",     fullId: "01-research" },
  { id: "02", label: "Planning",     fullId: "02-planning" },
  { id: "03", label: "Writing",      fullId: "03-writing" },
  { id: "04", label: "Quality",      fullId: "04-quality" },
  { id: "05", label: "Optimisation", fullId: "05-optimisation" },
  { id: "06", label: "Production",   fullId: "06-production" },
  { id: "07", label: "Publishing",   fullId: "07-publishing" },
  { id: "08", label: "Products",     fullId: "08-products" },
  { id: "09", label: "Series",       fullId: "09-series" },
  { id: "10", label: "Post-launch",  fullId: "10-postlaunch" },
];

type Status = "done" | "active" | "todo";

function statusFor(state: unknown, stageId: string): Status {
  if (!state || typeof state !== "object") return "todo";
  const s = state as Record<string, unknown>;
  const stages = (s.stages as Record<string, unknown> | undefined) ?? {};
  const node = stages[stageId] as Record<string, unknown> | undefined;
  if (node) {
    if (node.complete === true || node.status === "done") return "done";
    if (node.status === "in_progress" || node.in_progress === true) return "active";
  }
  const cs = s.current_stage;
  if (typeof cs === "string" && cs.startsWith(stageId)) return "active";
  return "todo";
}

const dotByStatus: Record<Status, string> = {
  done:   "bg-ok",
  active: "bg-warn",
  todo:   "bg-text-4",
};

const textByStatus: Record<Status, string> = {
  done:   "text-text-2",
  active: "text-text-1",
  todo:   "text-text-3",
};

/**
 * Linear-style stage tracker: a horizontal row of pills with a status dot
 * and a stage number + name. No gradients, no rings — just text + dot.
 */
export function StageTracker({
  state,
  bookSlug,
  className,
  compact,
}: {
  state: unknown;
  bookSlug?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <ol
      className={cn(
        "flex flex-wrap",
        compact ? "gap-1" : "gap-2",
        className
      )}
    >
      {STAGES.map((stage) => {
        const status = statusFor(state, stage.id);
        const body = (
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-md border border-line px-2 py-1 transition-colors",
              "bg-surface",
              bookSlug && "hover:bg-raised hover:border-line-2 cursor-pointer",
              textByStatus[status]
            )}
          >
            <span className={cn("status-dot", dotByStatus[status])} />
            <span className="font-mono text-xs text-text-4">{stage.id}</span>
            {!compact && (
              <span className="text-xs">{stage.label}</span>
            )}
          </div>
        );
        return (
          <li key={stage.id}>
            {bookSlug ? (
              <Link to={`/books/${bookSlug}/stage/${stage.fullId}`}>
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
