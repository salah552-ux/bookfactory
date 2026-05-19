import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// All dependencies mocked so handler tests run without filesystem/process side effects
vi.mock("../../lib/agents.js", () => ({
  loadAgents: vi
    .fn()
    .mockResolvedValue({ agents: [{ id: "market-researcher" }], manifest: {} }),
  clearAgentCache: vi.fn(),
}));
vi.mock("../../lib/state.js", () => ({
  listBooks: vi.fn().mockResolvedValue([{ slug: "my-book", state: null }]),
  readState: vi.fn().mockResolvedValue({ stage: 1 }),
  patchState: vi.fn().mockResolvedValue({ stage: 2 }),
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
    .mockResolvedValue({ path: "books", entries: [{ name: "my-book", type: "dir" }] }),
}));
vi.mock("../../lib/runner.js", () => ({
  runAgent: vi.fn().mockResolvedValue(undefined),
  runScript: vi.fn().mockResolvedValue(undefined),
  cancelRun: vi.fn().mockReturnValue(true),
}));
vi.mock("../../lib/runStore.js", () => ({
  listRuns: vi.fn().mockResolvedValue([{ runId: "r1", startedAt: 1 }]),
  readRun: vi
    .fn()
    .mockResolvedValue({ runId: "r1", startedAt: 1, chunks: [] }),
}));
vi.mock("../../paths.js", () => ({
  BOOKFACTORY_ROOT: "/tmp/handler-test-root",
  safeResolve: vi.fn((p: string) => `/tmp/handler-test-root/${p}`),
  toRel: vi.fn((p: string) => p.replace("/tmp/handler-test-root/", "")),
  bookDir: vi.fn(),
  bookStateFile: vi.fn(),
  BOOKS_DIR: "/tmp/handler-test-root/books",
  AGENTS_DIR: "/tmp/handler-test-root/.claude/agents",
  PIPELINE_MANIFEST: "/tmp/handler-test-root/.claude/agents/PIPELINE-MANIFEST.json",
  PIPELINE_STATE_TEMPLATE: "",
  PIPELINE_STATE_SCHEMA: "",
}));

import { handleConnection } from "../../ws/handler.js";

type SentMsg = Record<string, unknown>;

function createSocket() {
  const sent: SentMsg[] = [];
  const handlers: Record<string, ((...args: unknown[]) => void) | undefined> =
    {};
  return {
    readyState: 1 as const,
    OPEN: 1 as const,
    send(data: string) {
      sent.push(JSON.parse(data) as SentMsg);
    },
    on(ev: string, fn: (...args: unknown[]) => void) {
      handlers[ev] = fn;
    },
    close: vi.fn(),
    _sent: sent,
    _emit(ev: string, ...args: unknown[]) {
      handlers[ev]?.(...args);
    },
    _lastMsg(): SentMsg {
      return sent[sent.length - 1];
    },
  };
}

type MockSocket = ReturnType<typeof createSocket>;

async function dispatch(socket: MockSocket, msg: unknown) {
  socket._emit("message", Buffer.from(JSON.stringify(msg)));
  // Allow promise microtasks to settle
  await new Promise((r) => setTimeout(r, 0));
}

describe("handleConnection — basic handshake", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("sends hello immediately on connection", () => {
    expect(socket._sent[0]).toMatchObject({
      type: "hello",
      version: "0.1.0",
    });
  });

  it("responds to ping with pong", async () => {
    await dispatch(socket, { type: "ping" });
    expect(socket._lastMsg()).toMatchObject({ type: "pong" });
  });
});

describe("handleConnection — JSON and schema errors", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("returns invalid_json error for malformed JSON", async () => {
    socket._emit("message", Buffer.from("not { valid json"));
    await new Promise((r) => setTimeout(r, 0));
    expect(socket._lastMsg()).toMatchObject({
      type: "error",
      code: "invalid_json",
    });
  });

  it("returns invalid_message error for an unknown message type", async () => {
    await dispatch(socket, { type: "not.a.real.type" });
    expect(socket._lastMsg()).toMatchObject({
      type: "error",
      code: "invalid_message",
    });
  });

  it("returns invalid_message for a message missing required fields", async () => {
    await dispatch(socket, { type: "pipeline.read" }); // missing book
    expect(socket._lastMsg()).toMatchObject({
      type: "error",
      code: "invalid_message",
    });
  });
});

describe("handleConnection — agents.list", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("responds with agents.snapshot", async () => {
    await dispatch(socket, { type: "agents.list" });
    expect(socket._lastMsg()).toMatchObject({ type: "agents.snapshot" });
  });
});

describe("handleConnection — pipeline messages", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("pipeline.list → pipeline.list.snapshot", async () => {
    await dispatch(socket, { type: "pipeline.list" });
    expect(socket._lastMsg()).toMatchObject({ type: "pipeline.list.snapshot" });
  });

  it("pipeline.read → pipeline.snapshot for the requested book", async () => {
    await dispatch(socket, { type: "pipeline.read", book: "my-book" });
    expect(socket._lastMsg()).toMatchObject({
      type: "pipeline.snapshot",
      book: "my-book",
    });
  });

  it("pipeline.patch → pipeline.snapshot with merged state", async () => {
    await dispatch(socket, {
      type: "pipeline.patch",
      book: "my-book",
      patch: { stage: 2 },
    });
    expect(socket._lastMsg()).toMatchObject({
      type: "pipeline.snapshot",
      book: "my-book",
    });
  });

  it("pipeline.subscribe and pipeline.unsubscribe do not send a response", async () => {
    const countBefore = socket._sent.length;
    await dispatch(socket, { type: "pipeline.subscribe", book: "my-book" });
    await dispatch(socket, { type: "pipeline.unsubscribe", book: "my-book" });
    expect(socket._sent.length).toBe(countBefore);
  });
});

describe("handleConnection — file messages", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("file.read → file.snapshot", async () => {
    await dispatch(socket, { type: "file.read", path: "CLAUDE.md" });
    expect(socket._lastMsg()).toMatchObject({
      type: "file.snapshot",
      path: "CLAUDE.md",
    });
  });

  it("file.write → file.snapshot", async () => {
    await dispatch(socket, {
      type: "file.write",
      path: "test.md",
      content: "hello",
    });
    expect(socket._lastMsg()).toMatchObject({ type: "file.snapshot" });
  });

  it("file.list → file.list.snapshot", async () => {
    await dispatch(socket, { type: "file.list", path: "books" });
    expect(socket._lastMsg()).toMatchObject({ type: "file.list.snapshot" });
  });
});

describe("handleConnection — KDP publish gate", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("accepts the exact phrase PUBLISH and sets ok: true", async () => {
    await dispatch(socket, {
      type: "kdp.publish.confirm",
      book: "my-book",
      phrase: "PUBLISH",
    });
    expect(socket._lastMsg()).toMatchObject({
      type: "kdp.publish.result",
      book: "my-book",
      ok: true,
    });
  });

  it("rejects any other phrase and sets ok: false", async () => {
    for (const wrong of ["publish", "Publish", "PUBLIS", "yes", ""]) {
      await dispatch(socket, {
        type: "kdp.publish.confirm",
        book: "my-book",
        phrase: wrong,
      });
      expect(socket._lastMsg(), `phrase: "${wrong}"`).toMatchObject({
        type: "kdp.publish.result",
        ok: false,
      });
    }
  });
});

describe("handleConnection — runs", () => {
  let socket: MockSocket;

  beforeEach(() => {
    vi.unstubAllEnvs();
    socket = createSocket();
    handleConnection(socket as never);
  });

  afterEach(() => {
    socket._emit("close");
  });

  it("runs.list → runs.list.snapshot", async () => {
    await dispatch(socket, { type: "runs.list" });
    expect(socket._lastMsg()).toMatchObject({ type: "runs.list.snapshot" });
  });

  it("run.read with an existing runId → run.snapshot", async () => {
    await dispatch(socket, { type: "run.read", runId: "r1" });
    expect(socket._lastMsg()).toMatchObject({
      type: "run.snapshot",
      run: { runId: "r1" },
    });
  });

  it("run.read with a non-existent runId → error no_such_run", async () => {
    const { readRun } = await import("../../lib/runStore.js");
    vi.mocked(readRun).mockResolvedValueOnce(null);
    await dispatch(socket, { type: "run.read", runId: "does-not-exist" });
    expect(socket._lastMsg()).toMatchObject({
      type: "error",
      code: "no_such_run",
    });
  });
});

describe("handleConnection — auth", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("closes a connection with a wrong token when AUTH_MODE=token", () => {
    vi.stubEnv("AUTH_MODE", "token");
    vi.stubEnv("AUTH_TOKEN", "correct-secret");
    const socket = createSocket();
    handleConnection(socket as never, { tokenFromQuery: "wrong-token" });
    expect(socket.close).toHaveBeenCalledWith(1008, "auth_required");
  });

  it("sends hello when the correct token is provided", () => {
    vi.stubEnv("AUTH_MODE", "token");
    vi.stubEnv("AUTH_TOKEN", "correct-secret");
    const socket = createSocket();
    handleConnection(socket as never, { tokenFromQuery: "correct-secret" });
    expect(socket._sent[0]).toMatchObject({ type: "hello" });
    socket._emit("close");
  });

  it("allows connection without any token when AUTH_MODE is not set", () => {
    const socket = createSocket();
    handleConnection(socket as never);
    expect(socket._sent[0]).toMatchObject({ type: "hello" });
    socket._emit("close");
  });
});
