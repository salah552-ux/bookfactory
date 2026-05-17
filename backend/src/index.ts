import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { spawn } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { handleConnection } from "./ws/handler.js";
import { BOOKFACTORY_ROOT, BOOKS_DIR, AGENTS_DIR } from "./paths.js";
import { startWatcher, stopWatcher } from "./lib/watcher.js";

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? "127.0.0.1";

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    transport: { target: "pino-pretty", options: { colorize: true, singleLine: true } },
  },
});

await app.register(cors, { origin: true });
await app.register(websocket, {
  options: { maxPayload: 8 * 1024 * 1024 },
});

// ── /health — lightweight ────────────────────────────────────────
app.get("/health", async () => ({
  ok: true,
  version: "0.1.0",
  bookfactoryRoot: BOOKFACTORY_ROOT,
}));

// ── /diagnose — full self-check for the dashboard ────────────────
//
// Returns a checklist of every dependency the dashboard needs to drive
// the pipeline. Use this to debug why agents don't run, books don't
// appear, etc. — without needing terminal access.
app.get("/diagnose", async () => {
  const out: Record<string, unknown> = {
    bookfactoryRoot: BOOKFACTORY_ROOT,
    checks: {} as Record<string, { ok: boolean; detail?: string }>,
  };
  const c = out.checks as Record<string, { ok: boolean; detail?: string }>;

  // 1. BOOKFACTORY_ROOT exists
  c.root_exists = existsSync(BOOKFACTORY_ROOT)
    ? { ok: true, detail: BOOKFACTORY_ROOT }
    : { ok: false, detail: `not found: ${BOOKFACTORY_ROOT}` };

  // 2. books/ folder + count books
  if (existsSync(BOOKS_DIR)) {
    const slugs = readdirSync(BOOKS_DIR).filter((n) =>
      statSync(join(BOOKS_DIR, n)).isDirectory()
    );
    c.books_dir = { ok: true, detail: `${slugs.length} books: ${slugs.join(", ") || "(none)"}` };
  } else {
    c.books_dir = { ok: false, detail: `not found: ${BOOKS_DIR}` };
  }

  // 3. .claude/agents/ folder + count agents
  if (existsSync(AGENTS_DIR)) {
    const stages = readdirSync(AGENTS_DIR).filter((n) =>
      statSync(join(AGENTS_DIR, n)).isDirectory()
    );
    let agentCount = 0;
    for (const stage of stages) {
      try {
        agentCount += readdirSync(join(AGENTS_DIR, stage)).filter((n) =>
          n.endsWith(".md")
        ).length;
      } catch {}
    }
    c.agents_dir = { ok: true, detail: `${agentCount} agents across ${stages.length} stages` };
  } else {
    c.agents_dir = { ok: false, detail: `not found: ${AGENTS_DIR}` };
  }

  // 4. claude CLI available
  const cli = process.env.CLAUDE_CLI || "claude";
  const cliCheck = await new Promise<{ ok: boolean; detail: string }>((resolve) => {
    const proc = spawn(cli, ["--version"], { shell: true });
    let out = "";
    const timer = setTimeout(() => {
      try { proc.kill(); } catch {}
      resolve({ ok: false, detail: `'${cli} --version' timed out — likely not on PATH` });
    }, 5000);
    proc.stdout?.on("data", (b: Buffer) => (out += b.toString()));
    proc.stderr?.on("data", (b: Buffer) => (out += b.toString()));
    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ ok: false, detail: `'${cli}' not runnable: ${e.message}` });
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve({ ok: true, detail: out.trim().split("\n")[0] || "ok" });
      else resolve({ ok: false, detail: `'${cli} --version' exited ${code}: ${out.trim()}` });
    });
  });
  c.claude_cli = cliCheck;

  // 5. Build scripts present
  const scripts = ["new-book.sh", "build-manuscript.sh", "build-pdf.sh", "build-print-pdf.sh"];
  const missingScripts = scripts.filter(
    (s) => !existsSync(join(BOOKFACTORY_ROOT, s))
  );
  c.build_scripts = missingScripts.length === 0
    ? { ok: true, detail: `${scripts.length} scripts present` }
    : { ok: false, detail: `missing: ${missingScripts.join(", ")}` };

  // 6. Persistent runs dir is writable
  const runsDir = join(BOOKFACTORY_ROOT, ".bookfactory-runs");
  try {
    if (!existsSync(runsDir)) {
      (await import("node:fs/promises")).mkdir(runsDir, { recursive: true });
    }
    c.runs_writable = { ok: true, detail: runsDir };
  } catch (e) {
    c.runs_writable = { ok: false, detail: String(e) };
  }

  // 7. Auth state
  c.auth_mode = {
    ok: true,
    detail: process.env.AUTH_MODE === "token" ? "token (locked)" : "none (open)",
  };

  // Summary
  const failed = Object.entries(c).filter(([, v]) => !v.ok);
  out.summary = {
    pass: Object.keys(c).length - failed.length,
    fail: failed.length,
    failed_checks: failed.map(([k]) => k),
  };

  return out;
});

app.get("/ws", { websocket: true }, (socket, req) => {
  const token =
    typeof req.query === "object" && req.query !== null
      ? (req.query as Record<string, string | undefined>).token
      : undefined;
  handleConnection(
    socket as unknown as import("@fastify/websocket").WebSocket,
    { tokenFromQuery: token }
  );
});

const close = async () => {
  app.log.info("shutting down");
  await stopWatcher();
  await app.close();
  process.exit(0);
};
process.on("SIGINT", close);
process.on("SIGTERM", close);

try {
  await app.listen({ port: PORT, host: HOST });
  startWatcher();
  app.log.info({ port: PORT, host: HOST, bookfactoryRoot: BOOKFACTORY_ROOT }, "ready");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
