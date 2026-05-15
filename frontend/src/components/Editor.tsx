import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ws } from "@/lib/ws";
import { useWsEvent } from "@/hooks/useWs";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const MonacoEditor = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default }))
);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv as unknown as Parameters<typeof addFormats>[0]);

interface EditorProps {
  path: string;
  language?: "markdown" | "json";
  /** Optional JSON schema for validation. */
  schema?: object;
  className?: string;
  height?: number | string;
}

export function FileEditor({
  path,
  language,
  schema,
  className,
  height = 480,
}: EditorProps) {
  const [content, setContent] = useState<string>("");
  const [sha, setSha] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const lang = language ?? (path.endsWith(".json") ? "json" : "markdown");

  useEffect(() => {
    ws.send({ type: "file.read", path });
  }, [path]);

  useWsEvent("file.snapshot", (m) => {
    if (m.path !== path) return;
    setContent(m.content);
    setSha(m.sha);
    setDirty(false);
  });

  useWsEvent("file.changed", (m) => {
    if (m.path === path && m.sha !== sha && !dirty) {
      ws.send({ type: "file.read", path });
    }
  });

  const validation = useMemo(() => {
    if (lang !== "json") return { ok: true as const, errors: [] as string[] };
    try {
      const parsed = JSON.parse(content || "null");
      if (!schema) return { ok: true as const, errors: [] };
      const validate = ajv.compile(schema);
      if (validate(parsed)) return { ok: true as const, errors: [] };
      return {
        ok: false as const,
        errors: (validate.errors ?? []).map(
          (e) => `${e.instancePath || "/"} ${e.message ?? ""}`
        ),
      };
    } catch (err) {
      return {
        ok: false as const,
        errors: [err instanceof Error ? err.message : String(err)],
      };
    }
  }, [content, lang, schema]);

  function save() {
    if (validation.ok === false && lang === "json") return;
    setSaving(true);
    ws.send({ type: "file.write", path, content, sha });
    const off = ws.on((m) => {
      if (m.type === "file.snapshot" && m.path === path) {
        setSha(m.sha);
        setDirty(false);
        setSaving(false);
        setSavedAt(Date.now());
        off();
      } else if (m.type === "error" && m.message?.includes("sha mismatch")) {
        setSaving(false);
        off();
      }
    });
  }

  return (
    <div className={cn("flex flex-col border border-slate-800 rounded-md overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-300">{path}</span>
          {dirty && <span className="text-amber-400">●</span>}
          {!validation.ok && lang === "json" && (
            <span className="text-red-400">invalid JSON</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedAt && !dirty && (
            <span className="text-[11px] text-emerald-400">saved</span>
          )}
          <Button
            size="sm"
            onClick={save}
            disabled={
              saving ||
              !dirty ||
              (lang === "json" && validation.ok === false)
            }
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="p-6 text-xs text-slate-500">Loading editor…</div>
        }
      >
        <MonacoEditor
          height={height}
          language={lang}
          theme="vs-dark"
          value={content}
          onChange={(v) => {
            setContent(v ?? "");
            setDirty(true);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: lang === "markdown" ? "on" : "off",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </Suspense>
      {lang === "json" && validation.errors.length > 0 && (
        <ul className="bg-red-950/40 border-t border-red-900 px-3 py-2 text-[11px] text-red-300 max-h-24 overflow-auto font-mono">
          {validation.errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
