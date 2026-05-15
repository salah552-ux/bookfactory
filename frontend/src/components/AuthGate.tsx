import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { getAuthToken, setSetting } from "@/lib/env";
import { BookOpen, ShieldCheck } from "lucide-react";

/**
 * AuthGate renders a login screen when the WS connection closes immediately
 * with an auth_required error. Once the user enters a valid token, the WS
 * client reconnects with the token included on the URL.
 *
 * Demo mode bypasses this entirely.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const status = useWsStatus();
  const [needsAuth, setNeedsAuth] = useState(false);
  const [token, setToken] = useState(getAuthToken() ?? "");
  const [error, setError] = useState<string | null>(null);

  // Demo mode: never blocked.
  if (import.meta.env.VITE_DEMO === "true") return <>{children}</>;

  useWsEvent("error", (m) => {
    if (m.code === "auth_required") {
      setNeedsAuth(true);
      setError(m.message);
    }
  });

  // If the connection is open, we're authenticated (or auth is off).
  useEffect(() => {
    if (status === "open" && needsAuth) {
      setNeedsAuth(false);
      setError(null);
    }
  }, [status, needsAuth]);

  if (!needsAuth) return <>{children}</>;

  function save() {
    setSetting("bf.authToken", token);
    ws.stop();
    setTimeout(() => ws.start(), 200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-brand-tan" />
            <CardTitle>BookFactory · sign in</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-sm text-slate-400">
            The backend is configured for token auth. Paste the token from your
            <code className="mx-1 text-brand-tan">backend/.env</code>
            (<code>AUTH_TOKEN</code>) below.
          </p>
          {error && (
            <div className="rounded border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Token
            </span>
            <Input
              autoFocus
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="bearer token"
              className="mt-1 font-mono"
            />
          </label>
          <Button onClick={save} disabled={!token.trim()} className="w-full">
            <ShieldCheck className="size-4" /> Connect
          </Button>
          <p className="text-[11px] text-slate-500">
            Token is stored in <code>localStorage</code> on this device only.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
