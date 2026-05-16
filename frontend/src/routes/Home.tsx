import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { StageTracker } from "@/components/StageTracker";
import { Sparkline } from "@/components/Sparkline";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { BookEntry } from "@/lib/schemas";
import { ArrowUpRight, Filter, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

export function Home() {
  const [books, setBooks] = useState<BookEntry[] | null>(null);
  const status = useWsStatus();

  useEffect(() => {
    if (status === "open") ws.send({ type: "pipeline.list" });
  }, [status]);

  useWsEvent("pipeline.list.snapshot", (m) => setBooks(m.books));

  const loading = books === null;
  const total = books?.length ?? 0;

  const stats = useMemo(() => deriveStats(books), [books]);

  return (
    <div className="px-6 sm:px-10 py-10 max-w-6xl mx-auto space-y-10">
      <PageHeader
        title="Fleet"
        description="Every book in flight, every stage gate, every agent on call."
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => ws.send({ type: "pipeline.list" })}
              disabled={status !== "open"}
            >
              <RefreshCw className="size-3.5" /> Refresh
            </Button>
            <Link to="/books/new">
              <Button variant="primary" size="sm">
                <Plus className="size-3.5" /> New book
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats — single bordered row with hairline dividers + sparklines */}
      <div className="rounded-md border border-line bg-surface flex items-stretch overflow-hidden">
        <StatCell
          label="Books"
          value={loading ? "—" : String(total)}
          spark={[2, 2, 2, 3, 3, 3]}
        />
        <Divider />
        <StatCell
          label="In progress"
          value={loading ? "—" : String(stats.inProgress)}
          spark={[1, 1, 2, 2, 1, 2]}
        />
        <Divider />
        <StatCell
          label="Agents"
          value="44"
          spark={[44, 44, 44, 44, 44, 44]}
        />
        <Divider />
        <StatCell
          label="This week"
          value={loading ? "—" : `${stats.activityCount}`}
          spark={[1, 3, 2, 4, 3, 5]}
        />
      </div>

      {/* Books list */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-md font-semibold text-text-1">Your books</h2>
            <p className="text-sm text-text-3 mt-0.5">
              Click a book to open its hub, or any stage chip to jump straight to the panel.
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-text-3 hover:text-text-1 transition-colors">
            <Filter className="size-3" /> Filter
          </button>
        </div>

        <div className="rounded-md border border-line bg-surface overflow-hidden">
          {loading ? (
            <ul>
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className={cn("px-5 py-5", i > 0 && "border-t border-line")}
                >
                  <div className="shimmer h-4 w-56 rounded mb-2" />
                  <div className="shimmer h-3 w-72 rounded mb-4" />
                  <div className="flex gap-1.5">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} className="shimmer h-7 w-24 rounded" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : books.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-md text-text-2 mb-1">No books yet</p>
              <p className="text-sm text-text-4 mb-4">
                Scaffold your first project with the wizard.
              </p>
              <Link to="/books/new">
                <Button variant="primary" size="sm">
                  <Plus className="size-3.5" /> Start a book
                </Button>
              </Link>
            </div>
          ) : (
            <ul>
              {books.map((b, i) => (
                <BookRow key={b.slug} book={b} divided={i > 0} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function deriveStats(books: BookEntry[] | null) {
  if (!books) return { inProgress: 0, activityCount: 0 };
  let inProgress = 0;
  let activityCount = 0;
  for (const b of books) {
    const s = b.state as Record<string, unknown> | null;
    if (s && typeof s.current_stage === "string") inProgress += 1;
    // count "this week's activity" — placeholder: number of completed stages
    const stages = (s?.stages as Record<string, unknown> | undefined) ?? {};
    activityCount += Object.values(stages).filter(
      (n) => (n as Record<string, unknown>)?.complete === true
    ).length;
  }
  return { inProgress, activityCount };
}

function StatCell({
  label,
  value,
  spark,
}: {
  label: string;
  value: string;
  spark: number[];
}) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="text-xs text-text-3">{label}</div>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <div className="text-2xl font-semibold text-text-1 tnum tracking-tight">
          {value}
        </div>
        <Sparkline
          data={spark}
          className="text-text-4 group-hover:text-accent"
        />
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-line" />;
}

function BookRow({ book, divided }: { book: BookEntry; divided: boolean }) {
  const state = book.state as Record<string, unknown> | null;
  const title = (state?.book_title as string | undefined) ?? prettify(book.slug);
  const genre = (state?.genre as string | undefined) ?? null;
  const lastTouched = (state?.last_updated as string | undefined) ?? null;

  // Compute stage progress
  const stages = (state?.stages as Record<string, unknown> | undefined) ?? {};
  const completeCount = Object.values(stages).filter(
    (n) => (n as Record<string, unknown>)?.complete === true
  ).length;

  return (
    <li className={cn(divided && "border-t border-line")}>
      <Link
        to={`/books/${book.slug}`}
        className="group block px-5 py-5 hover:bg-raised/40 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-md font-medium text-text-1 truncate group-hover:text-accent transition-colors">
                {title}
              </h3>
              {genre && (
                <Chip tone="neutral" className="!py-0 !text-[10px]">
                  {genre}
                </Chip>
              )}
              <span className="text-xs text-text-4 tnum">
                stage {String(completeCount + 1).padStart(2, "0")}/10
              </span>
            </div>
            <div className="mt-1 text-xs font-mono text-text-4 truncate">
              {book.slug}
              {lastTouched && (
                <>
                  <span className="mx-2">·</span>
                  <span>last activity {lastTouched}</span>
                </>
              )}
            </div>
          </div>
          <ArrowUpRight className="size-4 text-text-4 group-hover:text-text-1 transition-colors shrink-0 mt-1" />
        </div>

        <div className="mt-4">
          <StageTracker state={book.state} bookSlug={book.slug} />
        </div>
      </Link>
    </li>
  );
}

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
