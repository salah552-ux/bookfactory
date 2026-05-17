import {
  Activity,
  Bell,
  Box,
  ChevronRight,
  Cpu,
  Database,
  Plug,
} from "lucide-react";
import { Link } from "react-router-dom";

const HEALTH_ITEMS = [
  { label: "Agent network",   Icon: Cpu      },
  { label: "Pipeline engine", Icon: Activity },
  { label: "Data stores",     Icon: Database },
  { label: "Integrations",    Icon: Plug     },
  { label: "Notifications",   Icon: Bell     },
];

interface ActivityItem {
  label: string;
  book: string;
  ago: string;
  tone: "violet" | "cyan" | "orange" | "green" | "magenta";
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { label: "Publishing package generated", book: "Fix Your Gut For Good",       ago: "2d", tone: "violet"  },
  { label: "Chapter 7 completed",          book: "The Dust Between Seconds",    ago: "5h", tone: "cyan"    },
  { label: "Brief approved",               book: "Death in the Cathedral Close",ago: "1h", tone: "orange"  },
  { label: "Cover concept generated",      book: "Fix Your Gut For Good",       ago: "1d", tone: "magenta" },
  { label: "Research report ready",        book: "The Dust Between Seconds",    ago: "6h", tone: "green"   },
];

const TONE_DOT: Record<ActivityItem["tone"], string> = {
  violet:  "bg-violet shadow-[0_0_8px_-1px_rgba(168,85,247,0.8)]",
  cyan:    "bg-cyan shadow-[0_0_8px_-1px_rgba(6,182,212,0.8)]",
  orange:  "bg-orange shadow-[0_0_8px_-1px_rgba(245,158,11,0.8)]",
  green:   "bg-green shadow-[0_0_8px_-1px_rgba(16,185,129,0.8)]",
  magenta: "bg-magenta shadow-[0_0_8px_-1px_rgba(236,72,153,0.8)]",
};

export function RightRail({ healthPct = 98 }: { healthPct?: number }) {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[320px] shrink-0">
      <SystemHealth healthPct={healthPct} />
      <RecentActivity />
    </aside>
  );
}

function SystemHealth({ healthPct }: { healthPct: number }) {
  // Circular SVG gauge
  const size = 130;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (healthPct / 100) * c;

  return (
    <div className="card p-5">
      <div className="text-[10px] font-semibold tracking-widest uppercase text-text-3 mb-2">
        System health
      </div>
      <div className="flex items-center gap-2 mb-5">
        <span className="size-2 rounded-full bg-green pulse-soft shadow-[0_0_8px_-1px_rgba(16,185,129,0.8)]" />
        <span className="text-sm text-text-2">AI system operational</span>
      </div>

      <div className="flex justify-center mb-5">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="url(#healthGrad)"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${filled} ${c}`}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 6px rgba(16,185,129,0.6))",
              }}
            />
            <defs>
              <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold tnum">{healthPct}%</div>
            <div className="text-[10px] text-text-3">System health</div>
          </div>
        </div>
      </div>

      <ul className="space-y-2.5">
        {HEALTH_ITEMS.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-2.5 text-xs">
            <Icon className="size-3.5 text-text-3" strokeWidth={1.75} />
            <span className="text-text-2 flex-1">{label}</span>
            <span className="text-green text-[11px]">Healthy</span>
            <span className="size-1.5 rounded-full bg-green shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="card p-5">
      <div className="text-[10px] font-semibold tracking-widest uppercase text-text-3 mb-3">
        Recent activity
      </div>
      <ul className="space-y-3.5">
        {RECENT_ACTIVITY.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-1 size-2 rounded-full shrink-0 ${TONE_DOT[item.tone]}`}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-text-1 leading-snug">
                {item.label}
              </div>
              <div className="text-[11px] text-text-3 mt-0.5 truncate">
                {item.book}
              </div>
            </div>
            <div className="text-[11px] text-text-3 tnum shrink-0">
              {item.ago}
            </div>
          </li>
        ))}
      </ul>
      <Link
        to="/runs"
        className="mt-4 flex items-center justify-between text-xs text-text-2 hover:text-text-1 px-3 py-2 rounded-md border border-line hover:border-line-2 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Box className="size-3.5" strokeWidth={1.75} /> View all runs
        </span>
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}
