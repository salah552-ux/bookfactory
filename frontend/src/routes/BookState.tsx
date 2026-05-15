import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FileEditor } from "@/components/Editor";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { ArrowLeft } from "lucide-react";

export function BookState() {
  const { slug = "" } = useParams<{ slug: string }>();
  const status = useWsStatus();
  const [schema, setSchema] = useState<object | null>(null);

  useEffect(() => {
    if (status === "open")
      ws.send({ type: "file.read", path: "pipeline-state.schema.json" });
  }, [status]);

  useWsEvent("file.snapshot", (m) => {
    if (m.path === "pipeline-state.schema.json") {
      try {
        setSchema(JSON.parse(m.content));
      } catch {
        // ignore
      }
    }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">
      <Link
        to={`/books/${slug}`}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="size-3" /> Book hub
      </Link>

      <div>
        <h1 className="font-display text-3xl tracking-tight">pipeline-state.json</h1>
        <p className="text-sm text-slate-400 mt-1">
          Schema-validated. Saves only enabled when JSON parses and matches the schema.
        </p>
      </div>

      <FileEditor
        path={`books/${slug}/pipeline-state.json`}
        language="json"
        schema={schema ?? undefined}
        height={620}
      />
    </div>
  );
}
