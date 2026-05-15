import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getWsUrl, getApiUrl, getAuthToken, setSetting } from "@/lib/env";
import { ws } from "@/lib/ws";

export function Settings() {
  const [wsUrl, setWsUrl] = useState(getWsUrl());
  const [apiUrl, setApiUrl] = useState(getApiUrl());
  const [authToken, setAuthToken] = useState(getAuthToken() ?? "");
  const [saved, setSaved] = useState(false);

  function save() {
    setSetting("bf.wsUrl", wsUrl);
    setSetting("bf.apiUrl", apiUrl);
    setSetting("bf.authToken", authToken);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    ws.stop();
    setTimeout(() => ws.start(), 200);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Backend URLs, auth, brand. Stored in <code>localStorage</code> (per browser).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backend</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Field label="WebSocket URL" hint="Defaults to /ws (Vite dev proxy).">
            <Input value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} />
          </Field>
          <Field label="HTTP API URL" hint="Defaults to /api (Vite dev proxy).">
            <Input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
          </Field>
          <Field label="Auth token" hint="Leave blank for local dev.">
            <Input
              value={authToken}
              type="password"
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="optional bearer token"
            />
          </Field>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save}>Save & reconnect</Button>
            {saved && (
              <span className="text-xs text-emerald-400">Saved.</span>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardBody className="text-sm text-slate-400 space-y-2">
          <div className="flex items-center gap-3">
            <span className="size-6 rounded bg-brand-navy border border-slate-700" />
            <code className="text-slate-300">#1b3a5c</code>
            <span className="text-slate-500">navy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="size-6 rounded bg-brand-tan border border-slate-700" />
            <code className="text-slate-300">#c8b99a</code>
            <span className="text-slate-500">warm tan</span>
          </div>
          <div className="pt-2 text-xs text-slate-500">
            Fonts: Playfair Display (display) · EB Garamond (body) · Lato (UI)
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}
