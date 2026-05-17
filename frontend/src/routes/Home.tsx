import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
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
      {/* Editorial masthead area */}
      <div className="max-w-[1200px] mx-auto px-10 pt-16 pb-10">

        {/* Issue header — magazine-style asymmetric */}
        <div className="grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="kicker">Fig. 01 — Volume Index</div>
            <h1 className="font-display text-4xl md:text-[80px] leading-[0.95] tracking-tight mt-4 text-text-1">
              The <em className="text-gold not-italic" style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>Fleet</em>
            </h1>
            <p className="pull-quote mt-6 max-w-lg text-text-2">
              Every book in flight, every gate, every agent — set in motion.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 md:text-right space-y-2">
            <Link
              to="/books/new"
              className="inline-flex items-center gap-2 px-5 py-3 border border-gold/60 text-gold hover:bg-gold-soft hover:border-gold transition-colors"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 17 }}
            >
              <Plus className="size-4" strokeWidth={1.5} />
              Open a new title
            </Link>
            <div className="fig-caption pt-2">N° {String(totals.total).padStart(2, "0")} · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
          </div>
        </div>

        <div className="gold-rule mt-12" />

        {/* Editorial ledger — stats in a hand-set row */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 pt-8">
          <Stat label="Titles in flight"   value={totals.total} />
          <Stat label="Currently working" value={totals.inProgress} />
          <Stat label="Specialists" value={44} />
          <Stat label="Recent dispatches" value={12} />
        </dl>

        <div className="hairline mt-10" />

        {/* Table of contents — editorial */}
        <div className="pt-12">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="kicker">II — In this issue</div>
              <h2 className="font-display text-3xl md:text-4xl text-text-1 mt-2">
                Titles <em className="italic text-gold" style={{fontFamily:"'Cormorant Garamond',serif"}}>in production</em>
              </h2>
            </div>
            <div className="fig-caption hidden md:block">Pipeline · 10 stages</div>
          </div>

          {books === null ? (
            <SkeletonList />
          ) : books.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-12 stagger">
              {books.map((b, i) => (
                <BookRow key={b.slug} book={b} index={i + 1} />
              ))}
            </ul>
          )}
        </div>

        {/* Colophon */}
        <div className="gold-rule mt-20 mb-6" />
        <div className="flex items-center justify-between fig-caption">
          <span>BookFactory · Volume I</span>
          <span>Set in Cormorant Garamond & Libre Baskerville · Edited by AI</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="kicker">{label}</dt>
      <dd className="font-display text-5xl md:text-6xl text-text-1 mt-2 onum tabular-nums leading-none">
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
        className="group grid grid-cols-12 gap-6 items-start py-4 -mx-3 px-3 transition-colors hover:bg-[rgba(245,239,224,0.02)]"
      >
        {/* Roman index */}
        <div className="col-span-1 hidden md:block">
          <div
            className="font-display italic text-3xl text-gold"
            style={{ fontFamily: '"Cormorant Garamond",serif' }}
          >
            {toRoman(index)}.
          </div>
        </div>

        {/* Cover */}
        <div className="col-span-3 md:col-span-2">
          <BookCover title={title} genre={genre} slug={book.slug} size="lg" />
        </div>

        {/* Title + meta block */}
        <div className="col-span-9 md:col-span-5">
          <div className="kicker">{genre.replace(/-/g, " · ")}</div>
          <h3 className="font-display text-3xl md:text-[40px] leading-[1.05] mt-2 text-text-1 group-hover:text-gold transition-colors drop-cap">
            {title}
          </h3>
          <div className="fig-caption mt-3 font-mono">{book.slug}</div>
          <div className="text-md text-text-2 mt-2" style={{ fontStyle: "italic", fontFamily:"'Cormorant Garamond',serif", fontSize: 18 }}>
            Currently in <span className="text-gold not-italic font-medium" style={{ fontFamily: '"Libre Baskerville", serif' }}>
              {stageLabel}
            </span>
            <span className="text-text-3"> · last activity {lastTouched}</span>
          </div>
        </div>

        {/* Pipeline ledger */}
        <div className="col-span-12 md:col-span-4">
          <div className="kicker mb-1">Pipeline</div>
          <StageProgress state={state} bookSlug={book.slug} />
        </div>
      </Link>
    </li>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-12">
      {[0, 1, 2].map((i) => (
        <li key={i} className="grid grid-cols-12 gap-6">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-3 md:col-span-2">
            <div className="w-[120px] h-[160px] shimmer rounded-[2px]" />
          </div>
          <div className="col-span-9 md:col-span-5 space-y-3">
            <div className="h-3 w-32 rounded shimmer" />
            <div className="h-8 w-72 rounded shimmer" />
            <div className="h-3 w-48 rounded shimmer" />
          </div>
          <div className="col-span-12 md:col-span-4 space-y-3 pt-6">
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
      <p className="pull-quote text-text-2">
        “The shelves are empty.”
      </p>
      <p className="text-md text-text-3 mt-3" style={{fontFamily:'"Libre Baskerville",serif'}}>
        Open a new title to commission the first volume.
      </p>
    </div>
  );
}

function toRoman(n: number): string {
  const lookup: Array<[number, string]> = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of lookup) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
