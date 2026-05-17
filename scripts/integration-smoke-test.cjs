#!/usr/bin/env node
/**
 * BookFactory end-to-end integration smoke test.
 *
 * Probes every WebSocket message type against a live local backend and
 * prints a pass/fail report. Used to verify the dashboard can actually
 * drive the pipeline.
 */
const WS = require("/home/user/bookfactory/backend/node_modules/ws");
const fs = require("fs");
const path = require("path");

const URL = process.env.WS_URL || "ws://127.0.0.1:8787/ws";
const ROOT = process.env.BOOKFACTORY_ROOT || "/home/user/bookfactory";

const results = [];
function pass(label, detail = "") {
  results.push({ ok: true, label, detail });
  console.log(`[32m✓[0m ${label}${detail ? "  [2m" + detail + "[0m" : ""}`);
}
function fail(label, detail = "") {
  results.push({ ok: false, label, detail });
  console.log(`[31m✘[0m ${label}${detail ? "  [2m" + detail + "[0m" : ""}`);
}

const s = new WS(URL);
const inbox = [];
s.on("message", (m) => inbox.push(JSON.parse(m.toString())));
s.on("error", (e) => { fail("connect", e.message); process.exit(1); });

const send = (m) => s.send(JSON.stringify(m));
const wait = (predicate, timeout = 5000) =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const found = inbox.find(predicate);
      if (found) return resolve(found);
      if (Date.now() - start > timeout) return reject(new Error("timeout"));
      setTimeout(check, 50);
    };
    check();
  });

async function run() {
  await new Promise((r) => s.once("open", r));
  pass("connect", URL);

  const hello = await wait((m) => m.type === "hello");
  pass("hello received", `version ${hello.version}`);

  // Probe 1 — agents.list
  send({ type: "agents.list" });
  const agents = await wait((m) => m.type === "agents.snapshot");
  pass(`agents.list — ${agents.agents.length} agents catalogued`);

  // Probe 2 — pipeline.list
  send({ type: "pipeline.list" });
  const books = await wait((m) => m.type === "pipeline.list.snapshot");
  pass(`pipeline.list — ${books.books.length} books`, books.books.map((b) => b.slug).join(", "));

  // Probe 3 — pipeline.read on one book
  if (books.books.length) {
    const slug = books.books[0].slug;
    send({ type: "pipeline.read", book: slug });
    const state = await wait((m) => m.type === "pipeline.snapshot" && m.book === slug);
    pass(`pipeline.read for ${slug}`, state.state ? "has state" : "null state");
  }

  // Probe 4 — file.read on an existing file
  send({ type: "file.read", path: "CLAUDE.md" });
  const file = await wait((m) => m.type === "file.snapshot" && m.path === "CLAUDE.md");
  pass(`file.read CLAUDE.md`, `${file.content.length} chars`);

  // Probe 5 — file.write + read-back round trip
  const tmpPath = "_smoke-test.md";
  const content = `# smoke-test ${Date.now()}\n`;
  send({ type: "file.write", path: tmpPath, content });
  const wrote = await wait((m) => m.type === "file.snapshot" && m.path === tmpPath);
  if (wrote.content === content) pass("file.write round-trip", `sha=${wrote.sha.slice(0, 8)}`);
  else fail("file.write round-trip");
  // Clean up
  try { fs.unlinkSync(path.join(ROOT, tmpPath)); } catch {}

  // Probe 6 — file.list on books dir
  send({ type: "file.list", path: "books" });
  const list = await wait((m) => m.type === "file.list.snapshot" && m.path === "books");
  pass(`file.list books/`, `${list.entries.length} entries`);

  // Probe 7 — build.run streaming (non-destructive: build-manuscript.sh with bad arg)
  const buildRunId = "smoke-build-" + Date.now();
  send({ type: "build.run", runId: buildRunId, script: "build-manuscript.sh", args: ["nope-no-such-book"] });
  const started = await wait((m) => m.type === "run.started" && m.runId === buildRunId);
  await wait((m) => m.type === "run.chunk" && m.runId === buildRunId);
  const finished = await wait((m) => m.type === "run.finished" && m.runId === buildRunId);
  pass(`build.run streaming`, `exit=${finished.exitCode} duration=${finished.durationMs}ms`);

  // Probe 8 — runs.list (must include our smoke-build)
  send({ type: "runs.list" });
  const runs = await wait((m) => m.type === "runs.list.snapshot");
  const persisted = runs.runs.find((r) => r.runId === buildRunId);
  if (persisted) pass(`runs.list persistence`, `${runs.runs.length} runs persisted`);
  else fail("runs.list persistence");

  // Probe 9 — run.read with chunks
  send({ type: "run.read", runId: buildRunId });
  const replay = await wait((m) => m.type === "run.snapshot" && m.run.runId === buildRunId);
  pass(`run.read replay`, `${replay.run.chunks.length} chunks recovered`);

  // Probe 10 — KDP publish gate, both states
  send({ type: "kdp.publish.confirm", book: "test", phrase: "wrong" });
  const rej = await wait((m) => m.type === "kdp.publish.result" && m.book === "test");
  if (rej.ok === false) pass(`kdp.publish.confirm rejects wrong phrase`);
  else fail("kdp.publish.confirm should reject wrong phrase");

  send({ type: "kdp.publish.confirm", book: "test2", phrase: "PUBLISH" });
  const ok = await wait((m) => m.type === "kdp.publish.result" && m.book === "test2");
  if (ok.ok === true) pass(`kdp.publish.confirm accepts PUBLISH`);
  else fail("kdp.publish.confirm should accept PUBLISH");

  // Probe 11 — pipeline.subscribe + file-watcher broadcast
  const slugForWatch = books.books.find((b) => b.state)?.slug;
  if (slugForWatch) {
    send({ type: "pipeline.subscribe", book: slugForWatch });
    const stateFile = path.join(ROOT, "books", slugForWatch, "pipeline-state.json");
    const original = fs.readFileSync(stateFile, "utf8");
    const obj = JSON.parse(original);
    obj._smoke_watch = Date.now();
    fs.writeFileSync(stateFile, JSON.stringify(obj, null, 2));
    try {
      await wait((m) => m.type === "pipeline.changed" && m.book === slugForWatch, 4000);
      pass(`file-watcher → pipeline.changed broadcast`);
    } catch {
      fail("file-watcher broadcast", "no pipeline.changed received within 4s");
    }
    fs.writeFileSync(stateFile, original);
  }

  // Summary
  console.log("");
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`[1m${passed} passed, ${failed} failed[0m`);
  s.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  fail("smoke run error", e.message);
  s.close();
  process.exit(1);
});
