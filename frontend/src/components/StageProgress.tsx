import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const STAGES = [
  "01","02","03","04","05","06","07","08","09","10",
];
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

/**
 * Editorial pipeline — each stage rendered as a small numbered mark
 * connected by a hairline rule. Active stage gets the gold dot + italic
 * "current" annotation hovering above (CSS-only).
 *
 * Inspired by a table of contents in a literary magazine.
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
    <div className={cn("flex items-end pt-5 pb-1", className)}>
      {STAGES.map((id, i) => {
        const status = statusFor(state, id);
        const prevStatus = i > 0 ? statusFor(state, STAGES[i - 1]) : "todo";
        const mark = (
          <div className={cn("stage-mark", status)}>
            <span className="num">{id}</span>
            <span className="dot" />
          </div>
        );
        return (
          <div key={id} className="flex items-end flex-1 last:flex-none">
            {i > 0 && (
              <div
                className={cn(
                  "stage-rule",
                  prevStatus === "done" && status !== "todo" && "done",
                  prevStatus === "done" && status === "done" && "done"
                )}
              />
            )}
            {bookSlug ? (
              <Link to={`/books/${bookSlug}/stage/${STAGE_FULL[id]}`}>
                {mark}
              </Link>
            ) : (
              mark
            )}
          </div>
        );
      })}
    </div>
  );
}
