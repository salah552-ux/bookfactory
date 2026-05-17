import {
  Search,
  ClipboardList,
  Pencil,
  ShieldCheck,
  TrendingUp,
  Settings2,
  Send,
  Package,
  Library,
  Rocket,
} from "lucide-react";

const STAGES = [
  { id: "01", label: "Research",     Icon: Search,       tone: "text-violet" },
  { id: "02", label: "Planning",     Icon: ClipboardList, tone: "text-orange" },
  { id: "03", label: "Writing",      Icon: Pencil,       tone: "text-cyan" },
  { id: "04", label: "Quality",      Icon: ShieldCheck,  tone: "text-green" },
  { id: "05", label: "Optimisation", Icon: TrendingUp,   tone: "text-orange" },
  { id: "06", label: "Production",   Icon: Settings2,    tone: "text-magenta" },
  { id: "07", label: "Publishing",   Icon: Send,         tone: "text-violet" },
  { id: "08", label: "Products",     Icon: Package,      tone: "text-cyan" },
  { id: "09", label: "Series",       Icon: Library,      tone: "text-green" },
  { id: "10", label: "Post-launch",  Icon: Rocket,       tone: "text-magenta" },
];

/**
 * Top of the books-in-flight table: 10 columns showing each stage's
 * number, name, and a small tinted icon. Matches the mockup.
 */
export function StageHeader() {
  return (
    <div className="flex items-end pb-4 mb-2 border-b border-line">
      {/* Spacer to align with book cover + title column */}
      <div className="w-[320px] shrink-0" />

      <div className="flex-1 flex items-center">
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            className="flex-1 flex flex-col items-center gap-1.5 px-1"
            style={{ minWidth: 0 }}
          >
            <div
              className={`text-base font-bold font-mono ${s.tone} leading-none`}
              style={{
                textShadow:
                  s.tone === "text-violet"  ? "0 0 12px rgba(168,85,247,0.5)"
                  : s.tone === "text-cyan"   ? "0 0 12px rgba(6,182,212,0.5)"
                  : s.tone === "text-green"  ? "0 0 12px rgba(16,185,129,0.5)"
                  : s.tone === "text-orange" ? "0 0 12px rgba(245,158,11,0.5)"
                  : s.tone === "text-magenta"? "0 0 12px rgba(236,72,153,0.5)"
                  : "none",
              }}
            >
              {s.id}
            </div>
            <div className="text-[10px] text-text-2 leading-none">{s.label}</div>
            <s.Icon
              className={`size-3.5 ${s.tone} opacity-80`}
              strokeWidth={1.75}
            />
            {/* hide connector column between columns */}
            {i < STAGES.length - 1 && <span />}
          </div>
        ))}
      </div>

      {/* Spacer to align with right-hand "current stage / last activity" column */}
      <div className="w-[140px] shrink-0" />
    </div>
  );
}
