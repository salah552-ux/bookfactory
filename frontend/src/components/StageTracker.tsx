import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const STAGES: Array<{ id: string; label: string; fullId: string }> = [
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

const chipStyle: Record<Status, string> = {
  done: "bg-emerald-900/30 text-emerald-300 ring-1 ring-emerald-700/40",
  active: "bg-amber-900/30 text-amber-200 ring-1 ring-amber-600/40",
  todo: "bg-slate-800/40 text-slate-500 ring-1 ring-slate-700/40",
};

const dotStyle: Record<Status, string> = {
  done:   "bg-emerald-400",
  active: "bg-amber-300 animate-pulse",
  todo:   "bg-slate-600",
};

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
    <ol className={cn("flex flex-wrap gap-1.5", className)}>
      {STAGES.map((stage, i) => {
        const status = statusFor(state, stage.id);
        const body = (
          <div
            className={cn(
              "relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[10px] min-w-[78px] transition-all",
              chipStyle[status],
              bookSlug && "hover:ring-brand-tan/40 hover:bg-slate-800/60 hover:text-slate-100 cursor-pointer"
            )}
          >
            <span className={cn("size-1.5 rounded-full shrink-0", dotStyle[status])} />
            <div className="flex flex-col leading-tight">
              <span className="font-mono opacity-60">{stage.id}</span>
              <span className="tracking-tight">{stage.label}</span>
            </div>
          </div>
        );
        return (
          <li key={stage.id} style={{ animationDelay: `${i * 20}ms` }}>
            {bookSlug ? (
              <Link to={`/books/${bookSlug}/stage/${stage.fullId}`}>{body}</Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
