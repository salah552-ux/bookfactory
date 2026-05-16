import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/PageHeader";
import { getWsUrl, getApiUrl, getAuthToken, setSetting } from "@/lib/env";
import { ws } from "@/lib/ws";
import { useUi } from "@/stores/ui";
import { Moon, ShieldCheck, Sun } from "lucide-react";

export function Settings() {
  const [wsUrl, setWsUrl] = useState(getWsUrl());
  const [apiUrl, setApiUrl] = useState(getApiUrl());
  const [authToken, setAuthToken] = useState(getAuthToken() ?? "");
  const [saved, setSaved] = useState(false);
  const { theme, toggleTheme } = useUi();

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
    <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-8">
      <PageHeader
        meta="Workspace"
        title="Settings"
        description="Backend connection, auth, and appearance. Stored per browser in localStorage."
      />

      <Card>
        <CardHeader>
          <CardTitle>Backend</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Field label="WebSocket URL" hint="Defaults to /ws (Vite dev proxy).">
            <Input value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} />
          </Field>
          <Field label="HTTP API URL" hint="Defaults to /api.">
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
            <Button onClick={save}>
              <ShieldCheck className="size-3.5" /> Save & reconnect
            </Button>
            {saved && <span className="text-xs text-emerald-400">Saved.</span>}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <button
            onClick={toggleTheme}
            className="surface surface-hover w-full flex items-center justify-between p-4"
          >
            <span className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="size-4 text-brand-tan" />
              ) : (
                <Sun className="size-4 text-amber-400" />
              )}
              <span className="text-sm text-slate-200">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </span>
            <span className="text-[11px] text-slate-500">click to toggle</span>
          </button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 text-sm">
          {[
            { hex: "#1b3a5c", name: "Navy",      bg: "bg-brand-navy" },
            { hex: "#c8b99a", name: "Warm tan",  bg: "bg-brand-tan" },
            { hex: "#d4af37", name: "Gold",      bg: "bg-[#d4af37]" },
            { hex: "#0a1424", name: "Deep ink",  bg: "bg-brand-ink" },
          ].map((c) => (
            <div key={c.hex} className="flex items-center gap-3">
              <span className={`size-7 rounded ${c.bg} ring-1 ring-slate-700`} />
              <code className="text-slate-200">{c.hex}</code>
              <span className="text-slate-500">{c.name}</span>
            </div>
          ))}
          <div className="hairline my-2" />
          <div className="text-xs text-slate-500">
            Display · Playfair Display · Body · EB Garamond · UI · Lato · Code · JetBrains Mono
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
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
