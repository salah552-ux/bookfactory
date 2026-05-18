/**
 * Integration smoke test — Phase 2.
 *
 * Starts a real Fastify + WebSocket server in-process, connects over TCP,
 * and verifies the full JSON protocol end-to-end. All business-logic
 * dependencies are mocked so the test needs no external state.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import Fastify from "fastify";
import wsPlugin from "@fastify/websocket";
import type { AddressInfo } from "node:net";
import type { FastifyInstance } from "fastify";

// Mock heavy dependencies so the server starts without real filesystem/Claude CLI
vi.mock("../../lib/agents.js", () => ({
  loadAgents: vi
    .fn()
    .mockResolvedValue({ agents: [{ id: "market-researcher" }], manifest: {} }),
  clearAgentCache: vi.fn(),
}));
vi.mock("../../lib/state.js", () => ({
  listBooks: vi.fn().mockResolvedValue([{ slug: "test-book", state: null }]),
  readState: vi.fn().mockResolvedValue(null),
  patchState: vi.fn().mockResolvedValue({}),
}));
vi.mock("../../lib/files.js", () => ({
  readTextFile: vi
    .fn()
    .mockResolvedValue({ path: "CLAUDE.md", content: "# hello", sha: "abc" }),
  writeTextFile: vi
    .fn()
    .mockResolvedValue({ path: "test.md", content: "new", sha: "def" }),
  listDir: vi
    .fn()
    .mockResolvedValue({ path: "books", entries: [] }),
}));
vi.mock("../../lib/runner.js", () => ({
  runAgent: vi.fn().mockResolvedValue(undefined),
  runScript: vi.fn().mockResolvedValue(undefined),
  cancelRun: vi.fn().mockReturnValue(false),
}));
vi.mock("../../lib/runStore.js", () => ({
  listRuns: vi.fn().mockResolvedValue([]),
  readRun: vi.fn().mockResolvedValue(null),
  flushRun: vi.fn().mockResolvedValue(undefined),
  startRunRecord: vi.fn().mockResolvedValue(undefined),
  appendRunChunk: vi.fn().mockResolvedValue(undefined),
  finishRunRecord: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("../../paths.js", () => ({
  BOOKFACTORY_ROOT: "/tmp/integration-test-root",
  safeResolve: vi.fn((p: string) => `/tmp/integration-test-root/${p}`),
  toRel: vi.fn((p: string) => p),
  bookDir: vi.fn(),
  bookStateFile: vi.fn(),
  BOOKS_DIR: "/tmp/integration-test-root/books",
  AGENTS_DIR: "/tmp/integration-test-root/.claude/agents",
  PIPELINE_MANIFEST: "",
  PIPELINE_STATE_TEMPLATE: "",
  PIPELINE_STATE_SCHEMA: "",
}));

import { handleConnection } from "../../ws/handler.js";

let app: FastifyInstance;
let wsUrl: string;

// Helper: create a connected WebSocket and wait for the hello message
async function connect(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.addEventListener("open", () => resolve(ws));
    ws.addEventListener("error", (e) => reject(e));
  });
}

// Helper: wait for a message of a specific type within a timeout
function waitFor(
  ws: WebSocket,
  predicate: (msg: Record<string, unknown>) => boolean,
  timeout = 3000
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("waitFor timeout")), timeout);
    ws.addEventListener("message", function handler(ev) {
      const msg = JSON.parse(String(ev.data)) as Record<string, unknown>;
      if (predicate(msg)) {
        clearTimeout(timer);
        ws.removeEventListener("message", handler);
        resolve(msg);
      }
    });
  });
}

function send(ws: WebSocket, msg: Record<string, unknown>) {
  ws.send(JSON.stringify(msg));
}

beforeAll(async () => {
  app = Fastify({ logger: false });
  await app.register(wsPlugin, { options: { maxPayload: 1024 * 1024 } });
  app.get("/ws", { websocket: true }, (socket) => {
    handleConnection(socket as never);
  });
  await app.listen({ port: 0, host: "127.0.0.1" });
  const addr = app.server.address() as AddressInfo;
  wsUrl = `ws://127.0.0.1:${addr.port}/ws`;
});

afterAll(async () => {
  await app.close();
});

describe("WebSocket protocol — handshake", () => {
  it("sends a hello message immediately after connection", async () => {
    const ws = await connect();
    const hello = await waitFor(ws, (m) => m.type === "hello");
    expect(hello).toMatchObject({ type: "hello", version: "0.1.0" });
    ws.close();
  });

  it("responds to ping with pong", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "ping" });
    const pong = await waitFor(ws, (m) => m.type === "pong");
    expect(pong.type).toBe("pong");
    ws.close();
  });
});

describe("WebSocket protocol — error handling", () => {
  it("returns invalid_json error for malformed JSON", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    ws.send("not { valid json at all");
    const err = await waitFor(ws, (m) => m.type === "error");
    expect(err).toMatchObject({ type: "error", code: "invalid_json" });
    ws.close();
  });

  it("returns invalid_message error for an unknown message type", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "totally.made.up.type" });
    const err = await waitFor(ws, (m) => m.type === "error");
    expect(err).toMatchObject({ type: "error", code: "invalid_message" });
    ws.close();
  });
});

describe("WebSocket protocol — agents", () => {
  it("agents.list returns a snapshot", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "agents.list" });
    const snap = await waitFor(ws, (m) => m.type === "agents.snapshot");
    expect(Array.isArray(snap.agents)).toBe(true);
    ws.close();
  });
});

describe("WebSocket protocol — pipeline", () => {
  it("pipeline.list returns a list snapshot", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "pipeline.list" });
    const snap = await waitFor(ws, (m) => m.type === "pipeline.list.snapshot");
    expect(Array.isArray(snap.books)).toBe(true);
    ws.close();
  });

  it("pipeline.read returns a snapshot for the requested book", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "pipeline.read", book: "test-book" });
    const snap = await waitFor(ws, (m) => m.type === "pipeline.snapshot");
    expect(snap).toMatchObject({ type: "pipeline.snapshot", book: "test-book" });
    ws.close();
  });
});

describe("WebSocket protocol — file I/O", () => {
  it("file.read returns a file snapshot", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "file.read", path: "CLAUDE.md" });
    const snap = await waitFor(ws, (m) => m.type === "file.snapshot");
    expect(snap).toMatchObject({ type: "file.snapshot", path: "CLAUDE.md" });
    ws.close();
  });

  it("file.write returns a file snapshot", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "file.write", path: "test.md", content: "new content" });
    const snap = await waitFor(ws, (m) => m.type === "file.snapshot");
    expect(snap.type).toBe("file.snapshot");
    ws.close();
  });

  it("file.list returns a directory listing", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "file.list", path: "books" });
    const snap = await waitFor(ws, (m) => m.type === "file.list.snapshot");
    expect(snap).toMatchObject({ type: "file.list.snapshot", path: "books" });
    ws.close();
  });
});

describe("WebSocket protocol — KDP publish gate", () => {
  it("accepts the exact phrase PUBLISH", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "kdp.publish.confirm", book: "my-book", phrase: "PUBLISH" });
    const result = await waitFor(ws, (m) => m.type === "kdp.publish.result");
    expect(result).toMatchObject({ ok: true, book: "my-book" });
    ws.close();
  });

  it("rejects any phrase other than PUBLISH", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "kdp.publish.confirm", book: "my-book", phrase: "publish" });
    const result = await waitFor(ws, (m) => m.type === "kdp.publish.result");
    expect(result).toMatchObject({ ok: false });
    ws.close();
  });
});

describe("WebSocket protocol — runs", () => {
  it("runs.list returns a snapshot", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "runs.list" });
    const snap = await waitFor(ws, (m) => m.type === "runs.list.snapshot");
    expect(Array.isArray(snap.runs)).toBe(true);
    ws.close();
  });

  it("run.read for a non-existent runId returns no_such_run error", async () => {
    const ws = await connect();
    await waitFor(ws, (m) => m.type === "hello");
    send(ws, { type: "run.read", runId: "no-such-run-xyz" });
    const err = await waitFor(ws, (m) => m.type === "error");
    expect(err).toMatchObject({ code: "no_such_run" });
    ws.close();
  });
});
