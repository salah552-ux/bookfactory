import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { StageTracker } from "@/components/StageTracker";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { BookEntry } from "@/lib/schemas";
import { ArrowUpRight, Plus, RefreshCw } from "lucide-react";

export function Home() {
  const [books, setBooks] = useState<BookEntry[] | null>(null);
  const status = useWsStatus();

  useEffect(() => {
    if (status === "open") ws.send({ type: "pipeline.list" });
  }, [status]);

  useWsEvent("pipeline.list.snapshot", (m) => setBooks(m.books));

  const loading = books === null;
  const total = books?.length ?? 0;
  const inProgress =
    books?.filter(
      (b) =>
        typeof (b.state as { current_stage?: string } | null)?.current_stage ===
        "string"
    ).length ?? 0;

  return (
    <div className="px-6 sm:px-10 py-10 max-w-6xl mx-auto space-y-8">
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

      {/* Stats — single row with hairline dividers */}
      <div className="flex items-stretch border border-line rounded-md bg-surface overflow-hidden">
        <Stat label="Books"        value={loading ? "—" : String(total)} />
        <Divider />
        <Stat label="In progress"  value={loading ? "—" : String(inProgress)} />
        <Divider />
        <Stat label="Agents"       value="44" />
        <Divider />
        <Stat label="Stages"       value="10" />
      </div>

      {/* Book list — flat rows, not cards */}
      <section>
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <h2 className="text-md font-semibold text-text-1">Books</h2>
          <span className="text-xs text-text-4 font-mono">{loading ? "" : `${total} total`}</span>
        </div>

        {loading ? (
          <div className="divide-y divide-line">
            {[0, 1, 2].map((i) => (
              <div key={i} className="py-4 flex items-center gap-4">
                <div className="shimmer h-4 w-48 rounded" />
                <div className="shimmer h-4 w-32 rounded" />
                <div className="shimmer h-4 w-20 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="py-16 text-center">
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
          <ul className="divide-y divide-line">
            {books.map((b) => (
              <BookRow key={b.slug} book={b} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 px-4 py-3">
      <div className="text-xs text-text-3">{label}</div>
      <div className="text-xl font-semibold text-text-1 mt-0.5 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-line" />;
}

function BookRow({ book }: { book: BookEntry }) {
  const state = book.state as Record<string, unknown> | null;
  const title = (state?.book_title as string | undefined) ?? prettify(book.slug);
  const genre = (state?.genre as string | undefined) ?? null;
  const rawStage = state?.current_stage;
  const currentStage = typeof rawStage === "string" ? rawStage : null;

  return (
    <li>
      <Link
        to={`/books/${book.slug}`}
        className="group block py-4 hover:bg-raised/40 -mx-3 px-3 rounded-md transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-md font-medium text-text-1 truncate group-hover:text-accent transition-colors">
                {title}
              </span>
              {genre && (
                <Chip tone="neutral" className="!py-0 !text-[10px]">
                  {genre}
                </Chip>
              )}
            </div>
            <div className="mt-1 text-xs font-mono text-text-4 truncate">
              {book.slug}
              {currentStage && (
                <>
                  <span className="mx-2">·</span>
                  <span className="text-text-3">current: {currentStage}</span>
                </>
              )}
            </div>
          </div>
          <ArrowUpRight className="size-4 text-text-4 group-hover:text-text-1 transition-colors shrink-0" />
        </div>
        <div className="mt-3">
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
