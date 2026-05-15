import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StageTracker } from "@/components/StageTracker";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { BookEntry } from "@/lib/schemas";
import { ChevronRight, RefreshCw } from "lucide-react";

export function Home() {
  const [books, setBooks] = useState<BookEntry[]>([]);
  const status = useWsStatus();

  useEffect(() => {
    if (status === "open") ws.send({ type: "pipeline.list" });
  }, [status]);

  useWsEvent("pipeline.list.snapshot", (m) => setBooks(m.books));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Fleet</h1>
          <p className="text-sm text-slate-400 mt-1">
            Every book under <code className="text-brand-tan">books/</code>, every stage, every gate.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => ws.send({ type: "pipeline.list" })}
          disabled={status !== "open"}
        >
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </div>

      {books.length === 0 ? (
        <Card>
          <CardBody className="text-sm text-slate-400">
            {status === "open"
              ? "No books found yet."
              : "Connecting to backend…"}
          </CardBody>
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

function BookCard({ book }: { book: BookEntry }) {
  const state = book.state as Record<string, unknown> | null;
  const title =
    (state?.book_title as string | undefined) ?? prettify(book.slug);
  const genre = (state?.genre as string | undefined) ?? "—";
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <div className="text-xs text-slate-500 mt-1 font-mono">{book.slug}</div>
          </div>
          <Link
            to={`/books/${book.slug}`}
            className="text-xs text-brand-tan hover:underline flex items-center gap-1"
          >
            Open <ChevronRight className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="text-xs text-slate-400">
          <span className="text-slate-500 mr-2">Genre</span>
          <span className="text-slate-200">{genre}</span>
        </div>
        <StageTracker state={book.state} />
      </CardBody>
    </Card>
  );
}

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
