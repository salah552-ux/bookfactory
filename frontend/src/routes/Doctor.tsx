import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/env";
import { useWsStatus } from "@/hooks/useWs";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";

interface Check {
  ok: boolean;
  detail?: string;
}
interface DiagnoseResult {
  bookfactoryRoot: string;
  checks: Record<string, Check>;
  summary: { pass: number; fail: number; failed_checks: string[] };
}

const CHECK_LABELS: Record<string, { title: string; help: string }> = {
  root_exists:    { title: "BookFactory root folder", help: "The directory the backend reads books/, .claude/, scripts from." },
  books_dir:      { title: "books/ folder",            help: "Each book lives in books/<slug>/." },
  agents_dir:     { title: ".claude/agents/ folder",   help: "Catalogue of all 44 specialist agents." },
  claude_cli:     { title: "claude CLI on PATH",       help: "Required to run agents. Install Claude Code: https://docs.claude.com/claude-code" },
  build_scripts:  { title: "Build scripts present",    help: "new-book.sh / build-manuscript.sh / build-pdf.sh / build-print-pdf.sh in the project root." },
  runs_writable:  { title: "Run history writable",     help: ".bookfactory-runs/ folder created for persistent run history." },
  auth_mode:      { title: "Auth mode",                help: "Set AUTH_MODE=token in backend/.env to require a token." },
};

export function Doctor() {
  const status = useWsStatus();
  const [result, setResult] = useState<DiagnoseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function probe() {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getApiUrl();
      const url = apiBase.endsWith("/") ? `${apiBase}diagnose` : `${apiBase}/diagnose`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (import.meta.env.VITE_DEMO !== "true") void probe();
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Doctor"
        description="Self-check of every dependency the dashboard needs. Run this when something isn't working."
        actions={
          <Button variant="secondary" size="sm" onClick={() => void probe()} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Re-check
          </Button>
        }
      />

      {/* Demo mode notice */}
      {import.meta.env.VITE_DEMO === "true" && (
        <Card>
          <CardBody className="text-sm text-text-2">
            You're on the hosted demo. The Doctor only works against a real local backend.
            Install + run BookFactory locally to use this page.
          </CardBody>
        </Card>
      )}

      {/* WS connection state */}
      <Card>
        <CardHeader><CardTitle>WebSocket connection</CardTitle></CardHeader>
        <CardBody>
          <StatusRow
            ok={status === "open"}
            title="Live WS"
            detail={`status: ${status}`}
            help="Backend WebSocket at /ws. Must be 'open' for any real-time feature to work."
          />
        </CardBody>
      </Card>

      {/* Diagnostic results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Backend self-check
            {result && (
              <span className="ml-3 text-xs text-text-3">
                {result.summary.pass} pass · {result.summary.fail} fail
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="text-sm text-red mb-3">
              Cannot reach the backend: {error}
              <div className="text-xs text-text-3 mt-1">
                Check that the backend is running on the URL configured in Settings.
              </div>
            </div>
          )}
          {!result && !error && !loading && (
            <div className="text-sm text-text-3">No data yet.</div>
          )}
          {loading && (
            <div className="text-sm text-text-3">Probing…</div>
          )}
          {result && (
            <div className="space-y-3">
              <div className="text-[11px] font-mono text-text-3">
                Root: {result.bookfactoryRoot}
              </div>
              {Object.entries(result.checks).map(([key, check]) => {
                const meta = CHECK_LABELS[key] ?? { title: key, help: "" };
                return (
                  <StatusRow
                    key={key}
                    ok={check.ok}
                    title={meta.title}
                    detail={check.detail}
                    help={meta.help}
                  />
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function StatusRow({
  ok,
  title,
  detail,
  help,
}: {
  ok: boolean;
  title: string;
  detail?: string;
  help?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-line bg-surface px-3 py-2.5">
      {ok ? (
        <CheckCircle2 className="size-4 text-green shrink-0 mt-0.5" strokeWidth={2} />
      ) : (
        <XCircle className="size-4 text-red shrink-0 mt-0.5" strokeWidth={2} />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm text-text-1 font-medium">{title}</div>
        {detail && (
          <div className="text-xs text-text-3 mt-0.5 font-mono break-all">
            {detail}
          </div>
        )}
        {!ok && help && (
          <div className="text-xs text-text-2 mt-1.5">{help}</div>
        )}
      </div>
    </div>
  );
}
