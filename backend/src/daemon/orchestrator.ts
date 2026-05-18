/**
 * The orchestrator daemon — Phase 1 of full pipeline automation.
 *
 * Behaviour for each scheduled run:
 *   1. If PAUSE_AUTOMATION exists → exit, do nothing.
 *   2. For every book under books/:
 *      a. If the book has reached an unapproved human gate → notify, skip.
 *      b. If the book has hit its daily spend cap → log, skip.
 *      c. Otherwise → invoke the pipeline-orchestrator agent (dry-run by default).
 *   3. Append every decision to AUTOMATION-LOG.md and any gate hits to
 *      NOTIFICATIONS.md.
 *
 * The daemon defaults to DRY_RUN. Set DAEMON_LIVE=true to actually invoke
 * the claude CLI.
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { BOOKFACTORY_ROOT, BOOKS_DIR } from "../paths.js";
import { isPaused, readPauseReason } from "./pause.js";
import { findBlockingGates } from "./gates.js";
import {
  appendSpendEntry,
  isOverDailyCap,
  readSpendLog,
} from "./spend.js";
import {
  appendActivityEntry,
  appendGateHit,
} from "./notifications.js";
import type { DaemonConfig, PipelineState } from "./types.js";

const DEFAULT_MAX_INVOCATIONS_PER_DAY = Number(
  process.env.DAEMON_MAX_INVOCATIONS_PER_DAY ?? 20
);

export function buildConfig(
  overrides: Partial<DaemonConfig> = {}
): DaemonConfig {
  return {
    maxInvocationsPerDay: DEFAULT_MAX_INVOCATIONS_PER_DAY,
    pauseFile: path.join(BOOKFACTORY_ROOT, "PAUSE_AUTOMATION"),
    bookfactoryRoot: BOOKFACTORY_ROOT,
    activityLogFile: path.join(BOOKFACTORY_ROOT, "AUTOMATION-LOG.md"),
    notificationsFile: path.join(BOOKFACTORY_ROOT, "NOTIFICATIONS.md"),
    dryRun: process.env.DAEMON_LIVE !== "true",
    ...overrides,
  };
}

export async function listBookSlugs(booksDir: string): Promise<string[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(booksDir);
  } catch {
    return [];
  }
  const result: string[] = [];
  for (const slug of entries) {
    if (slug.startsWith(".")) continue;
    try {
      const stat = await fs.stat(path.join(booksDir, slug));
      if (stat.isDirectory()) result.push(slug);
    } catch {
      // ignore
    }
  }
  return result.sort();
}

export async function readPipelineState(
  bookDir: string
): Promise<PipelineState | null> {
  try {
    const raw = await fs.readFile(
      path.join(bookDir, "pipeline-state.json"),
      "utf8"
    );
    return JSON.parse(raw) as PipelineState;
  } catch {
    return null;
  }
}

interface ProcessResult {
  slug: string;
  action: "invoked" | "blocked" | "spend_cap" | "no_state" | "error";
  detail?: string;
}

export async function processBook(
  slug: string,
  config: DaemonConfig,
  now: Date = new Date()
): Promise<ProcessResult> {
  const bookDir = path.join(config.bookfactoryRoot, "books", slug);
  const state = await readPipelineState(bookDir);
  if (!state) {
    return { slug, action: "no_state", detail: "pipeline-state.json missing" };
  }

  const blockingGates = findBlockingGates(state);
  if (blockingGates.length > 0) {
    await appendGateHit(config.notificationsFile, {
      ts: now,
      book: slug,
      gates: blockingGates,
    });
    return {
      slug,
      action: "blocked",
      detail: blockingGates.map((g) => g.name).join(", "),
    };
  }

  const spendLog = await readSpendLog(bookDir);
  if (isOverDailyCap(spendLog, config.maxInvocationsPerDay, now)) {
    return {
      slug,
      action: "spend_cap",
      detail: `${config.maxInvocationsPerDay} invocations already used today`,
    };
  }

  const runId = `daemon-${now.toISOString().slice(0, 10)}-${crypto
    .randomUUID()
    .slice(0, 8)}`;

  let exitCode = 0;
  let detail = `runId=${runId}`;

  if (config.dryRun) {
    detail = `DRY RUN — would invoke pipeline-orchestrator for ${slug}`;
  } else {
    exitCode = await invokeOrchestrator(slug, bookDir, runId);
    detail = `runId=${runId} exit=${exitCode}`;
  }

  await appendSpendEntry(bookDir, {
    ts: now.toISOString(),
    agent: "pipeline-orchestrator",
    runId,
    exitCode,
    dryRun: config.dryRun,
  });

  return { slug, action: "invoked", detail };
}

/**
 * Spawn the claude CLI to invoke the pipeline-orchestrator agent.
 * Returns the exit code. stdout/stderr are streamed to the daemon's own
 * stdout/stderr so they appear in cron logs.
 */
async function invokeOrchestrator(
  slug: string,
  bookDir: string,
  runId: string
): Promise<number> {
  const cli = process.env.CLAUDE_CLI || "claude";
  const prompt = [
    `Invoke the pipeline-orchestrator agent.`,
    `Book slug: ${slug}.`,
    `RunId: ${runId}.`,
    ``,
    `Advance the pipeline by one stage if possible. Stop at any human gate.`,
  ].join("\n");

  return new Promise((resolve) => {
    const proc = spawn(
      cli,
      ["-p", prompt, "--output-format", "stream-json", "--verbose"],
      {
        cwd: bookDir,
        env: { ...process.env },
        stdio: ["ignore", "inherit", "inherit"],
      }
    );
    proc.on("error", (err) => {
      console.error(`[daemon] claude spawn failed for ${slug}:`, err.message);
      resolve(-1);
    });
    proc.on("close", (code) => resolve(code ?? -1));
  });
}

export async function runDaemon(
  config: DaemonConfig = buildConfig()
): Promise<void> {
  const now = new Date();
  const ts = now.toISOString();

  if (await isPaused(config.pauseFile)) {
    const reason = await readPauseReason(config.pauseFile);
    console.log(
      `[daemon] ${ts} PAUSED${reason ? ` — ${reason}` : ""}. No work this run.`
    );
    await appendActivityEntry(config.activityLogFile, {
      ts: now,
      book: "—",
      action: "paused",
      detail: reason ?? "PAUSE_AUTOMATION file present",
    });
    return;
  }

  const booksDir = path.join(config.bookfactoryRoot, "books");
  const slugs = await listBookSlugs(booksDir);
  console.log(
    `[daemon] ${ts} starting — ${slugs.length} books, dryRun=${config.dryRun}, cap=${config.maxInvocationsPerDay}/day`
  );

  for (const slug of slugs) {
    try {
      const result = await processBook(slug, config, new Date());
      console.log(
        `[daemon] ${slug}: ${result.action}${result.detail ? ` — ${result.detail}` : ""}`
      );
      await appendActivityEntry(config.activityLogFile, {
        ts: new Date(),
        book: slug,
        action: result.action,
        detail: result.detail,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[daemon] ${slug}: error — ${msg}`);
      await appendActivityEntry(config.activityLogFile, {
        ts: new Date(),
        book: slug,
        action: "error",
        detail: msg,
      });
    }
  }

  console.log(`[daemon] ${new Date().toISOString()} done.`);
}

// Entry point — only runs when this file is executed directly (not on import)
const isDirectInvoke =
  process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));
if (isDirectInvoke) {
  runDaemon().catch((err) => {
    console.error("[daemon] fatal:", err);
    process.exit(1);
  });
}
