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

function StageDot({ status }: { status: Status }) {
  switch (status) {
    case "done":
      return <span className="size-1.5 rounded-full bg-text-2" />;
    case "active":
      return (
        <span className="relative inline-flex">
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="absolute inset-0 size-1.5 rounded-full bg-accent animate-ping opacity-50" />
        </span>
      );
    default:
      return (
        <span className="size-1.5 rounded-full border border-text-4" />
      );
  }
}

/**
 * Stage tracker — full-width strip of pills under a book row.
 * Direction B / Comfortable density.
 */
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
      {STAGES.map((stage) => {
        const status = statusFor(state, stage.id);
        const body = (
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-2.5 h-7 transition-colors",
              status === "done" && "border-line bg-surface text-text-2",
              status === "active" && "border-accent/30 bg-accent-soft text-text-1",
              status === "todo" && "border-line bg-transparent text-text-4",
              bookSlug && "hover:border-line-2 hover:bg-raised hover:text-text-1 cursor-pointer"
            )}
          >
            <StageDot status={status} />
            <span className="font-mono text-[11px] opacity-60">{stage.id}</span>
            <span className="text-xs">{stage.label}</span>
          </div>
        );
        return (
          <li key={stage.id}>
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
