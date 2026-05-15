import { cn } from "@/lib/cn";

const STAGES = [
  { id: "01", label: "Research" },
  { id: "02", label: "Planning" },
  { id: "03", label: "Writing" },
  { id: "04", label: "Quality" },
  { id: "05", label: "Optimisation" },
  { id: "06", label: "Production" },
  { id: "07", label: "Publishing" },
  { id: "08", label: "Products" },
  { id: "09", label: "Series" },
  { id: "10", label: "Post-launch" },
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
  className,
}: {
  state: unknown;
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap gap-1", className)}>
      {STAGES.map((stage) => {
        const status = statusFor(state, stage.id);
        return (
          <li
            key={stage.id}
            className={cn(
              "flex flex-col items-center px-2 py-1 rounded text-[10px] min-w-[64px]",
              status === "done" && "bg-emerald-900/40 text-emerald-300",
              status === "active" && "bg-amber-900/40 text-amber-300",
              status === "todo" && "bg-slate-800/60 text-slate-500"
            )}
          >
            <span className="font-mono">{stage.id}</span>
            <span className="tracking-tight">{stage.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
