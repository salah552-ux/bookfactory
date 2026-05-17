import { Play, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function LiveActivity({
  agentsActive = 32,
  running = 7,
  waiting = 5,
  failed = 0,
}: {
  agentsActive?: number;
  running?: number;
  waiting?: number;
  failed?: number;
}) {
  return (
    <div className="card px-5 py-3 flex items-center gap-5 flex-wrap">
      <div className="flex items-center gap-2 text-text-2">
        <Zap className="size-4 text-violet" strokeWidth={1.75} />
        <span className="text-[11px] font-semibold tracking-widest uppercase">
          Live pipeline activity
        </span>
      </div>

      <Stat tone="green"  value={agentsActive} label="agents active" />
      <Stat tone="cyan"   value={running}      label="tasks running" />
      <Stat tone="orange" value={waiting}      label="waiting"       />
      <Stat tone="text-3" value={failed}       label="failed"        />

      <div className="ml-auto flex items-center gap-3">
        <Link
          to="/runs"
          className="inline-flex items-center gap-2 text-xs text-text-1 hover:text-violet-2 transition-colors"
        >
          <Play className="size-3.5 fill-current" /> Open Runs
        </Link>
        <span className="text-xs text-text-3">Auto-refresh</span>
        <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-green shadow-[0_0_8px_-1px_rgba(16,185,129,0.6)]">
          <span className="size-3 rounded-full bg-white translate-x-3.5" />
        </span>
      </div>
    </div>
  );
}

function Stat({
  tone,
  value,
  label,
}: {
  tone: "green" | "cyan" | "orange" | "text-3";
  value: number;
  label: string;
}) {
  const colours: Record<typeof tone, string> = {
    green:    "text-green",
    cyan:     "text-cyan",
    orange:   "text-orange",
    "text-3": "text-text-3",
  };
  return (
    <span className="flex items-baseline gap-1.5 text-sm">
      <span className={`${colours[tone]} font-semibold tnum`}>{value}</span>
      <span className="text-text-3">{label}</span>
    </span>
  );
}
