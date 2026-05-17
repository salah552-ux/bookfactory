import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowUpRight } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { StageProgress } from "@/components/StageProgress";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { BookEntry as BookEntryRow } from "@/lib/schemas";

const STAGE_LABELS: Record<string, string> = {
  "01": "Research",
  "02": "Planning",
  "03": "Writing",
  "04": "Quality",
  "05": "Optimisation",
  "06": "Production",
  "07": "Publishing",
  "08": "Products",
  "09": "Series",
  "10": "Post-launch",
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
  const [books, setBooks] = useState<BookEntryRow[] | null>(null);
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
    <div className="min-h-full">
      <div className="max-w-[1200px] mx-auto px-12 pt-16 pb-12">
        {/* Header */}
        <div className="flex items-start justify-between gap-8">
          <div>
            <div className="kicker">Volume Index</div>
            <h1
              className="text-text-1 mt-3"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                fontSize: 64,
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              The <em className="text-primary not-italic" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontWeight: 600 }}>Fleet</em>
            </h1>
            <p className="pull-quote mt-4 max-w-lg">
              Every book in flight, every gate, every agent — set in motion.
            </p>
          </div>

          <Link
            to="/books/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors rounded-md shadow-sm whitespace-nowrap"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 500 }}
          >
            <Plus className="size-4" strokeWidth={1.75} />
            New title
          </Link>
        </div>

        <div className="hairline mt-12" />

        {/* Stats row */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
          <Stat label="Titles in flight" value={totals.total} />
          <Stat label="Currently working" value={totals.inProgress} />
          <Stat label="Specialists" value={44} />
          <Stat label="Dispatches" value={12} />
        </dl>

        <div className="hairline mt-12" />

        {/* Titles list */}
        <div className="pt-12">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="kicker">In this issue</div>
              <h2
                className="text-text-1 mt-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                  fontSize: 32,
                  letterSpacing: "-0.015em",
                }}
              >
                Titles <em className="text-primary" style={{ fontStyle: "italic", fontFamily: '"Playfair Display", serif' }}>in production</em>
              </h2>
            </div>
            <div className="fig-caption hidden md:block">10 stages</div>
          </div>

          {books === null ? (
            <SkeletonList />
          ) : books.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-8 stagger">
              {books.map((b, i) => (
                <BookRow key={b.slug} book={b} index={i + 1} />
              ))}
            </ul>
          )}
        </div>

        <div className="hairline mt-16 mb-6" />
        <div className="flex items-center justify-between fig-caption">
          <span>BookFactory · Volume I</span>
          <span>Set in Playfair Display · WCAG 2.2 AA</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="kicker">{label}</dt>
      <dd
        className="text-text-1 mt-2 tabular-nums leading-none"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          fontSize: 48,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </dd>
    </div>
  );
}

function BookRow({ book, index }: { book: BookEntryRow; index: number }) {
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
        className="group grid grid-cols-12 gap-6 items-start py-4 px-3 -mx-3 rounded-md hover:bg-raised transition-colors"
      >
        <div className="col-span-1 hidden md:flex items-center justify-center pt-4">
          <div
            className="text-text-3 italic"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            {String(index).padStart(2, "0")}
          </div>
        </div>

        <div className="col-span-3 md:col-span-2">
          <BookCover title={title} genre={genre} slug={book.slug} size="lg" />
        </div>

        <div className="col-span-9 md:col-span-5">
          <div className="kicker">{genre.replace(/-/g, " · ")}</div>
          <h3
            className="text-text-1 mt-2 group-hover:text-primary transition-colors"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {title}
            <ArrowUpRight className="inline size-5 ml-2 text-text-4 group-hover:text-primary transition-colors" strokeWidth={1.5} />
          </h3>
          <div className="fig-caption mt-3 font-mono normal-case">{book.slug}</div>
          <div
            className="text-text-2 mt-3"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontStyle: "italic" }}
          >
            Currently in <span className="text-primary not-italic font-medium">{stageLabel}</span>
            <span className="text-text-3"> · {lastTouched}</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="kicker mb-2">Pipeline</div>
          <StageProgress state={state} bookSlug={book.slug} />
        </div>
      </Link>
    </li>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-8">
      {[0, 1, 2].map((i) => (
        <li key={i} className="grid grid-cols-12 gap-6 py-4">
          <div className="col-span-1"></div>
          <div className="col-span-2"><div className="w-[112px] h-[152px] shimmer rounded-md" /></div>
          <div className="col-span-5 space-y-3">
            <div className="h-3 w-32 rounded shimmer" />
            <div className="h-8 w-72 rounded shimmer" />
            <div className="h-3 w-48 rounded shimmer" />
          </div>
          <div className="col-span-4 space-y-3 pt-6">
            <div className="h-3 w-20 rounded shimmer" />
            <div className="h-6 w-full rounded shimmer" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <p className="pull-quote">
        “The shelves are empty.”
      </p>
      <p className="text-md text-text-3 mt-3" style={{ fontFamily: '"Playfair Display", serif' }}>
        Open a new title to commission the first volume.
      </p>
    </div>
  );
}

function prettify(slug: string) {
  return slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}
