import type { WebSocket } from "@fastify/websocket";
import { ClientMsg, type ServerMsg } from "../schemas.js";
import { loadAgents } from "../lib/agents.js";
import { listBooks, readState, patchState } from "../lib/state.js";
import { readTextFile, writeTextFile, listDir } from "../lib/files.js";
import { runAgent, runScript, cancelRun } from "../lib/runner.js";
import { BOOKFACTORY_ROOT } from "../paths.js";

interface ConnState {
  subscribedBooks: Set<string>;
  authed: boolean;
}

const connections = new Map<WebSocket, ConnState>();

function isAuthed(authedFromHandshake: boolean): boolean {
  if (process.env.AUTH_MODE !== "token") return true;
  return authedFromHandshake;
}

/**
 * Allow other parts of the server (e.g. a file watcher) to broadcast events
 * to subscribed clients.
 */
export function broadcast(predicate: (state: ConnState) => boolean, msg: ServerMsg): void {
  for (const [socket, state] of connections) {
    if (!predicate(state)) continue;
    safeSend(socket, msg);
  }
}

export function handleConnection(
  socket: WebSocket,
  opts: { tokenFromQuery?: string } = {}
): void {
  const tokenMode = process.env.AUTH_MODE === "token";
  const expected = process.env.AUTH_TOKEN ?? "";
  const tokenOK =
    !tokenMode || (expected !== "" && opts.tokenFromQuery === expected);

  const state: ConnState = {
    subscribedBooks: new Set(),
    authed: tokenOK,
  };
  connections.set(socket, state);

  if (!tokenOK) {
    send(socket, {
      type: "error",
      code: "auth_required",
      message: "Auth token required. Pass ?token= on the WebSocket URL.",
    });
    socket.close(1008, "auth_required");
    return;
  }

  send(socket, {
    type: "hello",
    version: "0.1.0",
    bookfactoryRoot: BOOKFACTORY_ROOT,
  });

  socket.on("message", async (raw: Buffer) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      return send(socket, {
        type: "error",
        code: "invalid_json",
        message: "Message was not valid JSON.",
      });
    }

    const result = ClientMsg.safeParse(parsed);
    if (!result.success) {
      return send(socket, {
        type: "error",
        code: "invalid_message",
        message: "Message did not match schema.",
        detail: result.error.flatten(),
      });
    }

    if (!isAuthed(state.authed)) {
      return send(socket, {
        type: "error",
        code: "auth_required",
        message: "Not authenticated.",
      });
    }

    try {
      await dispatch(socket, state, result.data);
    } catch (err) {
      send(socket, {
        type: "error",
        code: "handler_error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  socket.on("close", () => {
    connections.delete(socket);
  });
}

async function dispatch(socket: WebSocket, state: ConnState, msg: import("../schemas.js").ClientMsg) {
  const emit = (m: ServerMsg) => send(socket, m);

  switch (msg.type) {
    case "ping":
      return send(socket, { type: "pong" });

    case "agents.list": {
      const { agents, manifest } = await loadAgents();
      return send(socket, { type: "agents.snapshot", agents, manifest });
    }

    case "pipeline.list": {
      const books = await listBooks();
      return send(socket, { type: "pipeline.list.snapshot", books });
    }

    case "pipeline.read": {
      const st = await readState(msg.book);
      return send(socket, { type: "pipeline.snapshot", book: msg.book, state: st });
    }

    case "pipeline.patch": {
      const next = await patchState(msg.book, msg.patch);
      send(socket, { type: "pipeline.snapshot", book: msg.book, state: next });
      broadcast(
        (cs) => cs.subscribedBooks.has(msg.book),
        { type: "pipeline.changed", book: msg.book, state: next, source: "patch" }
      );
      return;
    }

    case "pipeline.subscribe":
      state.subscribedBooks.add(msg.book);
      return;

    case "pipeline.unsubscribe":
      state.subscribedBooks.delete(msg.book);
      return;

    case "file.read": {
      const snap = await readTextFile(msg.path);
      return send(socket, { type: "file.snapshot", ...snap });
    }

    case "file.write": {
      const snap = await writeTextFile(msg.path, msg.content, msg.sha);
      return send(socket, { type: "file.snapshot", ...snap });
    }

    case "file.list": {
      const { path, entries } = await listDir(msg.path);
      return send(socket, { type: "file.list.snapshot", path, entries });
    }

    case "agent.run":
      await runAgent({
        runId: msg.runId,
        agent: msg.agent,
        book: msg.book,
        prompt: msg.prompt,
        agentArgs: msg.args,
        emit,
      });
      return;

    case "agent.cancel": {
      const ok = cancelRun(msg.runId);
      if (!ok) emit({ type: "error", runId: msg.runId, code: "no_such_run", message: "Run not found." });
      return;
    }

    case "build.run":
      await runScript({
        runId: msg.runId,
        script: msg.script,
        book: msg.book,
        scriptArgs: msg.args,
        emit,
      });
      return;

    case "kdp.publish.confirm": {
      const ok = msg.phrase === "PUBLISH";
      return send(socket, {
        type: "kdp.publish.result",
        book: msg.book,
        ok,
        message: ok
          ? "Publish confirmation accepted. kdp-upload-agent gate cleared."
          : "Rejected: phrase must be the exact word PUBLISH.",
      });
    }
  }
}

function send(socket: WebSocket, msg: ServerMsg) {
  safeSend(socket, msg);
}

function safeSend(socket: WebSocket, msg: ServerMsg) {
  if (socket.readyState !== socket.OPEN) return;
  socket.send(JSON.stringify(msg));
}
