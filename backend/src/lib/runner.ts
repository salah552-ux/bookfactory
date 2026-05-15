import { spawn, ChildProcess } from "node:child_process";
import path from "node:path";
import { BOOKFACTORY_ROOT, bookDir } from "../paths.js";
import type { ServerMsg } from "../schemas.js";

export type Emit = (msg: ServerMsg) => void;

interface ActiveRun {
  proc: ChildProcess;
  startedAt: number;
}

const active = new Map<string, ActiveRun>();

export function isRunActive(runId: string): boolean {
  return active.has(runId);
}

export function cancelRun(runId: string): boolean {
  const r = active.get(runId);
  if (!r) return false;
  r.proc.kill("SIGTERM");
  return true;
}

/**
 * Invoke a Claude Code agent by shelling out to the `claude` CLI in
 * non-interactive print mode. The agent name maps to the .md file under
 * .claude/agents/<stage>/<agent>.md — we rely on Claude Code's agent routing.
 */
export async function runAgent(args: {
  runId: string;
  agent: string;
  book?: string;
  prompt?: string;
  agentArgs?: Record<string, unknown>;
  emit: Emit;
}): Promise<void> {
  const { runId, agent, book, prompt, agentArgs, emit } = args;
  const cli = process.env.CLAUDE_CLI || "claude";

  const userPrompt = buildPrompt(agent, book, prompt, agentArgs);

  const cwd = book ? bookDir(book) : BOOKFACTORY_ROOT;

  emit({
    type: "run.started",
    runId,
    agent,
    book,
    ts: Date.now(),
  });

  const startedAt = Date.now();
  const proc = spawn(cli, ["-p", userPrompt, "--output-format", "stream-json", "--verbose"], {
    cwd,
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  active.set(runId, { proc, startedAt });

  proc.stdout?.setEncoding("utf8");
  proc.stderr?.setEncoding("utf8");

  let stdoutBuf = "";
  proc.stdout?.on("data", (chunk: string) => {
    stdoutBuf += chunk;
    let nl: number;
    while ((nl = stdoutBuf.indexOf("\n")) >= 0) {
      const line = stdoutBuf.slice(0, nl);
      stdoutBuf = stdoutBuf.slice(nl + 1);
      forwardJsonLine(runId, line, emit);
    }
  });

  proc.stderr?.on("data", (chunk: string) => {
    emit({ type: "run.chunk", runId, stream: "stderr", text: chunk });
  });

  proc.on("error", (err) => {
    emit({
      type: "error",
      runId,
      code: "spawn_failed",
      message: err.message,
    });
  });

  await new Promise<void>((resolve) => {
    proc.on("close", (code) => {
      if (stdoutBuf.length > 0) forwardJsonLine(runId, stdoutBuf, emit);
      active.delete(runId);
      emit({
        type: "run.finished",
        runId,
        exitCode: code ?? -1,
        durationMs: Date.now() - startedAt,
      });
      resolve();
    });
  });
}

/**
 * Run one of the BookFactory build scripts. cwd is the project root because
 * the scripts expect to be invoked from there (per the scripts themselves).
 */
export async function runScript(args: {
  runId: string;
  script: string;
  book?: string;
  scriptArgs?: string[];
  emit: Emit;
}): Promise<void> {
  const { runId, script, book, scriptArgs, emit } = args;
  const scriptPath = path.join(BOOKFACTORY_ROOT, script);
  const argv = [scriptPath, ...(book ? [book] : []), ...(scriptArgs ?? [])];

  emit({ type: "run.started", runId, script, book, ts: Date.now() });
  const startedAt = Date.now();

  const proc = spawn("bash", argv, {
    cwd: BOOKFACTORY_ROOT,
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  active.set(runId, { proc, startedAt });

  proc.stdout?.setEncoding("utf8");
  proc.stderr?.setEncoding("utf8");
  proc.stdout?.on("data", (text: string) =>
    emit({ type: "run.chunk", runId, stream: "stdout", text })
  );
  proc.stderr?.on("data", (text: string) =>
    emit({ type: "run.chunk", runId, stream: "stderr", text })
  );

  await new Promise<void>((resolve) => {
    proc.on("close", (code) => {
      active.delete(runId);
      emit({
        type: "run.finished",
        runId,
        exitCode: code ?? -1,
        durationMs: Date.now() - startedAt,
      });
      resolve();
    });
  });
}

function buildPrompt(
  agent: string,
  book: string | undefined,
  userPrompt: string | undefined,
  agentArgs: Record<string, unknown> | undefined
): string {
  const lines: string[] = [];
  lines.push(`Invoke the ${agent} agent.`);
  if (book) lines.push(`Book slug: ${book}.`);
  if (agentArgs && Object.keys(agentArgs).length > 0) {
    lines.push(`Arguments: ${JSON.stringify(agentArgs)}`);
  }
  if (userPrompt) lines.push("", userPrompt);
  return lines.join("\n");
}

/**
 * Claude CLI in stream-json mode emits one JSON object per line. We forward
 * meaningful text content as run.chunk events; everything else passes through
 * as a structured stdout chunk so the UI can render it.
 */
function forwardJsonLine(runId: string, line: string, emit: Emit): void {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const obj = JSON.parse(trimmed);
    if (obj?.type === "assistant" && obj?.message?.content) {
      for (const block of obj.message.content) {
        if (block?.type === "text" && typeof block.text === "string") {
          emit({ type: "run.chunk", runId, stream: "stdout", text: block.text });
        } else if (block?.type === "tool_use") {
          emit({
            type: "run.chunk",
            runId,
            stream: "tool",
            text: `[tool:${block.name}]`,
          });
        }
      }
      return;
    }
    emit({ type: "run.chunk", runId, stream: "stdout", text: trimmed });
  } catch {
    emit({ type: "run.chunk", runId, stream: "stdout", text: line });
  }
}
