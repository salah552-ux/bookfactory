import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { StageTracker } from "@/components/StageTracker";
import { BookCardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { BookEntry } from "@/lib/schemas";
import { ArrowUpRight, BookPlus, Library, RefreshCw } from "lucide-react";

export function Home() {
  const [books, setBooks] = useState<BookEntry[] | null>(null);
  const status = useWsStatus();

  useEffect(() => {
    if (status === "open") ws.send({ type: "pipeline.list" });
  }, [status]);

  useWsEvent("pipeline.list.snapshot", (m) => setBooks(m.books));

  const loading = books === null;
  const total = books?.length ?? 0;
  const inProgress = books?.filter(
    (b) =>
      typeof (b.state as { current_stage?: string } | null)?.current_stage ===
      "string"
  ).length ?? 0;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10">
      <PageHeader
        eyebrow="Fleet · all books"
        title="Your publishing pipeline"
        subtitle="Every book in flight, every stage gate, every agent on call. Click into any book to drive its next move."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => ws.send({ type: "pipeline.list" })}
              disabled={status !== "open"}
            >
              <RefreshCw className="size-3.5" /> Refresh
            </Button>
            <Link to="/books/new">
              <Button variant="gold" size="sm">
                <BookPlus className="size-3.5" /> New book
              </Button>
            </Link>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Books" value={loading ? "—" : String(total)} />
        <StatTile label="In progress" value={loading ? "—" : String(inProgress)} />
        <StatTile label="Agents" value="44" />
        <StatTile label="Stages" value="10" />
      </div>

      {/* Books */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      ) : books.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Library className="size-5" />}
            title="No books yet"
            description="Scaffold your first project with the wizard — it sets up BLUEPRINT, FACTS, manuscript skeleton, and the right writer routing."
            action={
              <Link to="/books/new">
                <Button variant="gold">
                  <BookPlus className="size-4" /> Start a book
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {books.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface px-4 py-3">
      <div className="eyebrow">{label}</div>
      <div className="text-display text-2xl text-slate-100 mt-1">{value}</div>
    </div>
  );
}

function BookCard({ book }: { book: BookEntry }) {
  const state = book.state as Record<string, unknown> | null;
  const title = (state?.book_title as string | undefined) ?? prettify(book.slug);
  const genre = (state?.genre as string | undefined) ?? "—";
  const currentStage = (state?.current_stage as string | undefined) ?? null;

  return (
    <Link to={`/books/${book.slug}`}>
      <Card hoverable className="h-full">
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold tracking-tight text-slate-100 truncate">
                {title}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                {book.slug}
              </div>
            </div>
            <ArrowUpRight className="size-4 text-slate-500 group-hover:text-brand-tan shrink-0 mt-1" />
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-2 py-0.5 text-slate-300 ring-1 ring-slate-700/60">
              <span className="size-1.5 rounded-full bg-brand-tan" />
              {genre}
            </span>
            {currentStage && (
              <span className="text-slate-500">
                currently · <span className="text-slate-300">{currentStage}</span>
              </span>
            )}
          </div>

          <div className="hairline" />

          <StageTracker state={book.state} bookSlug={book.slug} />
        </CardBody>
      </Card>
    </Link>
  );
}

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
