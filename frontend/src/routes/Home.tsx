import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Bot, Clock, Timer } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StageHeader } from "@/components/StageHeader";
import { StageProgress } from "@/components/StageProgress";
import { BookCover } from "@/components/BookCover";
import { RightRail } from "@/components/RightRail";
import { LiveActivity } from "@/components/LiveActivity";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { BookEntry } from "@/lib/schemas";

const STAGE_LABELS: Record<string, string> = {
  "01": "01 Research",
  "02": "02 Planning",
  "03": "03 Writing",
  "04": "04 Quality",
  "05": "05 Optimisation",
  "06": "06 Production",
  "07": "07 Publishing",
  "08": "08 Products",
  "09": "09 Series",
  "10": "10 Post-launch",
};

function activeStageId(state: unknown): string | null {
  if (!state || typeof state !== "object") return null;
  const s = state as Record<string, unknown>;
  const cs = s.current_stage;
  if (typeof cs === "string") {
    const m = cs.match(/^(\d{2})/);
    return m ? m[1] : null;
  }
  const stages = (s.stages as Record<string, unknown> | undefined) ?? {};
  for (const id of Object.keys(stages).sort()) {
    const node = stages[id] as Record<string, unknown>;
    if (node?.status === "in_progress" || node?.in_progress === true) return id;
  }
  return null;
}

export function Home() {
  const [books, setBooks] = useState<BookEntry[] | null>(null);
  const status = useWsStatus();

  useEffect(() => {
    if (status === "open") ws.send({ type: "pipeline.list" });
  }, [status]);
  useWsEvent("pipeline.list.snapshot", (m) => setBooks(m.books));

  const totals = useMemo(() => {
    if (!books) return { total: 0, inProgress: 0 };
    let inProgress = 0;
    for (const b of books) if (activeStageId(b.state)) inProgress += 1;
    return { total: books.length, inProgress };
  }, [books]);

  return (
    <div className="p-6 sm:p-10 max-w-[1600px] mx-auto">
      <div className="flex gap-6 items-start">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Header row: title + 4 stat cards */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Fleet</h1>
              <p className="text-md text-text-2 mt-1.5 max-w-xl">
                Live overview of every book in flight, pipeline progress, and system health.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 max-w-3xl">
              <StatCard tone="violet"  icon={<BookOpen className="size-4" strokeWidth={2} />} value={totals.total} label="Books total" />
              <StatCard tone="cyan"    icon={<Timer    className="size-4" strokeWidth={2} />} value={totals.inProgress} label="Books in progress" />
              <StatCard tone="green"   icon={<Bot      className="size-4" strokeWidth={2} />} value={44}                label="Agents total" />
              <StatCard tone="magenta" icon={<Clock    className="size-4" strokeWidth={2} />} value={12}                label="Runs this week" />
            </div>
          </div>

          {/* Books in flight panel */}
          <div className="card p-6">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-text-3 mb-4">
              Books in flight
            </div>

            <StageHeader />

            <ul className="space-y-1">
              {books === null
                ? [0, 1, 2].map((i) => <SkeletonRow key={i} />)
                : books.map((b) => <BookRow key={b.slug} book={b} />)}
            </ul>
          </div>

          <LiveActivity />
        </div>

        <RightRail healthPct={98} />
      </div>
    </div>
  );
}

function BookRow({ book }: { book: BookEntry }) {
  const state = book.state as Record<string, unknown> | null;
  const title = (state?.book_title as string | undefined) ?? prettify(book.slug);
  const genre = (state?.genre as string | undefined) ?? "FICTION";
  const lastTouched = (state?.last_updated as string | undefined) ?? "—";
  const active = activeStageId(state);
  const stageLabel = active ? STAGE_LABELS[active] : "—";

  return (
    <li>
      <Link
        to={`/books/${book.slug}`}
        className="group block py-4 px-2 -mx-2 rounded-lg hover:bg-white/[0.025] transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Cover + title block (fixed 320px to align with StageHeader spacer) */}
          <div className="w-[320px] shrink-0 flex items-center gap-4">
            <BookCover title={title} genre={genre} slug={book.slug} size="md" />
            <div className="min-w-0">
              <div className="text-md font-semibold text-text-1 truncate group-hover:text-violet-2 transition-colors">
                {title}
              </div>
              <div className="text-xs text-text-3 mt-1 truncate">
                {genre.replace(/-/g, " · ").toLowerCase()}
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="flex-1 min-w-0">
            <StageProgress state={state} bookSlug={book.slug} />
          </div>

          {/* Right-hand stage label + last activity (fixed 140px) */}
          <div className="w-[140px] shrink-0">
            <div className="text-md font-semibold text-violet-2">{stageLabel}</div>
            <div className="text-[11px] text-text-3 mt-0.5">Current stage</div>
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-text-3">
              <Clock className="size-3" strokeWidth={1.75} />
              <span className="tnum">{lastTouched}</span>
            </div>
            <div className="text-[11px] text-text-3 -mt-0.5">Last activity</div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function SkeletonRow() {
  return (
    <li className="py-5">
      <div className="flex items-center gap-4">
        <div className="w-[320px] flex items-center gap-4 shrink-0">
          <div className="w-16 h-20 rounded-md shimmer" />
          <div className="flex-1">
            <div className="h-4 w-40 rounded shimmer mb-2" />
            <div className="h-3 w-24 rounded shimmer" />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="size-8 rounded-full shimmer" />
          ))}
        </div>
        <div className="w-[140px] shrink-0">
          <div className="h-4 w-24 rounded shimmer mb-2" />
          <div className="h-3 w-16 rounded shimmer" />
        </div>
      </div>
    </li>
  );
}

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
