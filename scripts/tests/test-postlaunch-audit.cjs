#!/usr/bin/env node
// Tests for postlaunch-audit.cjs — pure-function checks, no real books/ touched.
const assert = require("assert");
const { auditBook, ACTIVATION_FIELDS, STALE_DAYS } = require("../postlaunch-audit.cjs");

const NOW = Date.parse("2026-07-09T00:00:00Z");
const fullActivation = () => {
  const a = {};
  for (const f of ACTIVATION_FIELDS) a[f] = true;
  return a;
};
const live = (post_launch) => ({ human_gates: { published: true }, post_launch });

// 1. Non-published book → never audited, no findings.
assert.deepStrictEqual(auditBook("draft", { human_gates: { published: false } }, NOW), []);

// 2. Live book, no post_launch at all → INV-16 CRITICAL (blind) + INV-15 CRITICAL (cold).
{
  const f = auditBook("blind", live(undefined), NOW);
  assert.ok(f.some((x) => x.code === "INV-16" && x.level === "CRITICAL"), "expected INV-16");
  assert.ok(f.some((x) => x.code === "INV-15" && x.level === "CRITICAL"), "expected INV-15");
}

// 3. Fresh observation + all four activation fields true → clean.
{
  const f = auditBook("good", live({
    observations: [{ date: "2026-07-01", source: "KDP dashboard 2026-07-01" }],
    launch_activation: fullActivation(),
  }), NOW);
  assert.deepStrictEqual(f, []);
}

// 4. Newest observation 40 days old → INV-16 CRITICAL (stale).
{
  const f = auditBook("stale", live({
    observations: [{ date: "2026-05-30", source: "KDP dashboard 2026-05-30" }],
    launch_activation: fullActivation(),
  }), NOW);
  assert.ok(f.some((x) => x.code === "INV-16" && x.level === "CRITICAL"), "expected stale INV-16");
  assert.ok((NOW - Date.parse("2026-05-30")) / 86400000 > STALE_DAYS, "fixture really is stale");
}

// 5. One activation field missing → INV-15 CRITICAL naming the missing field.
{
  const act = fullActivation();
  delete act.aplus_submitted;
  const f = auditBook("cold", live({
    observations: [{ date: "2026-07-01", source: "KDP dashboard 2026-07-01" }],
    launch_activation: act,
  }), NOW);
  const inv15 = f.find((x) => x.code === "INV-15");
  assert.ok(inv15 && inv15.msg.includes("aplus_submitted"), "INV-15 must name the missing lever");
}

// 6. Re-rank applied 15 days ago, no observation on/after the Day-14 due date → WARN RERANK (Day-14 only, not Day-30).
{
  const f = auditBook("rerank", live({
    observations: [{ date: "2026-06-25", source: "KDP dashboard 2026-06-25" }],
    launch_activation: fullActivation(),
    rerank: { applied_date: "2026-06-24" },
  }), NOW);
  const warns = f.filter((x) => x.code === "RERANK");
  assert.strictEqual(warns.length, 1, "exactly one RERANK warn (Day-14 due, Day-30 not yet)");
  assert.strictEqual(warns[0].level, "WARN");
  assert.ok(warns[0].msg.includes("Day-14"));
}

// 7. Re-rank applied 15 days ago WITH a re-observation after the due date → no RERANK warn.
{
  const f = auditBook("rerank-ok", live({
    observations: [{ date: "2026-07-08", source: "KDP dashboard 2026-07-08" }],
    launch_activation: fullActivation(),
    rerank: { applied_date: "2026-06-24" },
  }), NOW);
  assert.deepStrictEqual(f.filter((x) => x.code === "RERANK"), []);
}

// 8. Schema-aware INV-16: a fresh, SOURCED weekly_log[] entry (no observations[] at all)
// must clear INV-16 — this is the shape the weekly heartbeat + post-launch-tracker agent
// actually writes in production (books/death-in-the-cathedral-close/pipeline-state.json).
{
  const f = auditBook("weekly-good", live({
    weekly_log: [{ date: "2026-07-01", source: "Architect — KDP dashboard" }],
    launch_activation: fullActivation(),
  }), NOW);
  assert.deepStrictEqual(f.filter((x) => x.code === "INV-16"), []);
}

// 9. weekly_log[] entry with NO source key → INV-16 still fires (zero-tolerance: unsourced
// entries never count, no matter which array they live in).
{
  const f = auditBook("weekly-unsourced", live({
    weekly_log: [{ date: "2026-07-01" }],
    launch_activation: fullActivation(),
  }), NOW);
  assert.ok(f.some((x) => x.code === "INV-16" && x.level === "CRITICAL"), "unsourced weekly_log entry must not clear INV-16");
}

// 10. INV-15 aplus legacy alias: post_launch.aplus_content_live === true satisfies the
// aplus_submitted lever even though launch_activation.aplus_submitted is absent — but
// the OTHER missing levers must still be listed (only aplus gets the alias).
{
  const f = auditBook("aplus-alias", live({
    observations: [{ date: "2026-07-01", source: "KDP dashboard 2026-07-01" }],
    launch_activation: { category_verified_live: true },
    aplus_content_live: true,
  }), NOW);
  const inv15 = f.find((x) => x.code === "INV-15");
  assert.ok(inv15, "expected INV-15 for the still-missing levers");
  assert.ok(!inv15.msg.includes("aplus_submitted"), "aplus lever satisfied via legacy alias must not be listed as missing");
  assert.ok(inv15.msg.includes("author_central_live") && inv15.msg.includes("arc_outreach_sent"), "other missing levers must still be listed");
}

console.log("ALL PASS — postlaunch-audit");
