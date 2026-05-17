import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

const STAGE_IDS = ["01","02","03","04","05","06","07","08","09","10"];

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

// Active-stage colour by stage index — matches the mockup's per-book colour
function activeTone(stageId: string): "violet" | "cyan" | "orange" {
  const n = parseInt(stageId, 10);
  if (n >= 7) return "violet";
  if (n >= 3 && n <= 5) return "cyan";
  return "orange";
}

const STAGE_FULL: Record<string, string> = {
  "01": "01-research",
  "02": "02-planning",
  "03": "03-writing",
  "04": "04-quality",
  "05": "05-optimisation",
  "06": "06-production",
  "07": "07-publishing",
  "08": "08-products",
  "09": "09-series",
  "10": "10-postlaunch",
};

/**
 * Horizontal pipeline strip — 10 stages with circles + connector lines.
 * Matches the ChatGPT mockup exactly.
 */
export function StageProgress({
  state,
  bookSlug,
  className,
}: {
  state: unknown;
  bookSlug?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      {STAGE_IDS.map((id, i) => {
        const status = statusFor(state, id);
        const tone = activeTone(id);
        const circle = (
          <div
            className={cn(
              "stage-circle",
              status === "done" && "done",
              status === "active" && `active ${tone}`,
              status === "todo" && "todo"
            )}
            title={`Stage ${id}`}
          >
            {status === "done" ? (
              <Check className="size-3.5" strokeWidth={3} />
            ) : (
              id
            )}
          </div>
        );
        const prevStatus = i > 0 ? statusFor(state, STAGE_IDS[i - 1]) : "todo";
        return (
          <div key={id} className="flex items-center flex-1 last:flex-none">
            {i > 0 && (
              <div
                className={cn(
                  "stage-connector",
                  prevStatus === "done" && status !== "todo" && "done",
                  prevStatus === "done" && status === "done" && "done"
                )}
              />
            )}
            {bookSlug ? (
              <Link to={`/books/${bookSlug}/stage/${STAGE_FULL[id]}`}>
                {circle}
              </Link>
            ) : (
              circle
            )}
          </div>
        );
      })}
    </div>
  );
}
