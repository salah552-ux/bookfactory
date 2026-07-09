#!/usr/bin/env node
/*
 * postlaunch-audit.cjs — audits every LIVE (published) book for a closed
 * post-launch feedback loop.
 *
 * A live book must have:
 *   INV-16 — at least one real, sourced KDP observation, the newest <= 30 days old.
 *   INV-15 — all launch-activation levers recorded true (category verified live,
 *            A+ submitted, Author Central live, ARC outreach sent).
 *   RERANK — (WARN) if the Backlist Re-Rank Pack was applied, Day-14 and Day-30
 *            re-observations must be logged once due (ALGO-INTELLIGENCE v1.3 §23 Lever 6).
 *
 * Pure module + CLI. Read-only: it never writes anything.
 * Numbers enter the system ONLY via scripts/log-launch-metrics.cjs (--source required).
 *
 * Usage: node scripts/postlaunch-audit.cjs      # audit all live books, exit 1 on CRITICAL
 */
const fs = require("fs");
const path = require("path");

const DAY = 86400000;
const STALE_DAYS = 30;
const RERANK_DUE_DAYS = [14, 30];
const ACTIVATION_FIELDS = [
  "category_verified_live",
  "aplus_submitted",
  "author_central_live",
  "arc_outreach_sent",
];

function auditBook(slug, state, now = Date.now()) {
  const findings = [];
  const hg = state.human_gates || {};
  if (hg.published !== true) return findings; // only live books are audited

  const pl = state.post_launch || {};
  const obs = Array.isArray(pl.observations) ? pl.observations : [];

  // INV-16 — observation exists and is fresh
  if (obs.length === 0) {
    findings.push({
      level: "CRITICAL", code: "INV-16",
      msg: `live book has ZERO post-launch observations — the feedback loop is open. Log real KDP dashboard data: node scripts/log-launch-metrics.cjs ${slug} --bsr <n> --reviews <n> --source "KDP dashboard <date>"`,
    });
  } else {
    const stamps = obs.map((o) => Date.parse(o.date)).filter(Number.isFinite);
    const newest = stamps.length ? Math.max(...stamps) : NaN;
    if (!Number.isFinite(newest)) {
      findings.push({ level: "CRITICAL", code: "INV-16", msg: "observations exist but none has a parseable date." });
    } else if ((now - newest) / DAY > STALE_DAYS) {
      findings.push({
        level: "CRITICAL", code: "INV-16",
        msg: `newest observation is ${Math.floor((now - newest) / DAY)} days old (limit ${STALE_DAYS}) — re-log from the KDP dashboard.`,
      });
    }
  }

  // INV-15 — launch activation levers recorded
  const act = pl.launch_activation || {};
  const missing = ACTIVATION_FIELDS.filter((f) => act[f] !== true);
  if (missing.length) {
    findings.push({
      level: "CRITICAL", code: "INV-15",
      msg: `cold launch — activation levers not recorded: ${missing.join(", ")}. Record each once genuinely done: node scripts/log-launch-metrics.cjs ${slug} --activate <field>`,
    });
  }

  // RERANK — Day-14 / Day-30 re-observation discipline (ALGO v1.3 §23 Lever 6)
  const rr = pl.rerank || {};
  if (rr.applied_date) {
    const applied = Date.parse(rr.applied_date);
    if (Number.isFinite(applied)) {
      for (const dueDays of RERANK_DUE_DAYS) {
        const due = applied + dueDays * DAY;
        if (now < due) continue;
        const hasReobs = obs.some((o) => {
          const t = Date.parse(o.date);
          return Number.isFinite(t) && t >= due;
        });
        if (!hasReobs) {
          findings.push({
            level: "WARN", code: "RERANK",
            msg: `re-rank applied ${rr.applied_date}; the Day-${dueDays} re-observation is due and not logged.`,
          });
        }
      }
    }
  }

  return findings;
}

function auditLiveBooks(booksDir, now = Date.now()) {
  const results = [];
  let slugs = [];
  try {
    slugs = fs.readdirSync(booksDir).filter((d) => fs.existsSync(path.join(booksDir, d, "pipeline-state.json")));
  } catch (_) { /* no books dir */ }
  for (const slug of slugs) {
    let state;
    try { state = JSON.parse(fs.readFileSync(path.join(booksDir, slug, "pipeline-state.json"), "utf8")); }
    catch (_) { continue; } // corrupt state is preflight §6's job, not ours
    const findings = auditBook(slug, state, now);
    if (findings.length) results.push({ slug, findings });
  }
  return results;
}

module.exports = { auditBook, auditLiveBooks, ACTIVATION_FIELDS, STALE_DAYS };

if (require.main === module) {
  const FACTORY = path.resolve(__dirname, "..");
  const results = auditLiveBooks(path.join(FACTORY, "books"));
  if (results.length === 0) {
    console.log("POST-LAUNCH AUDIT: clean — every live book has fresh sourced observations + recorded activation.");
    process.exit(0);
  }
  let crit = 0;
  for (const r of results) {
    for (const f of r.findings) {
      if (f.level === "CRITICAL") crit++;
      console.log(`[${f.level}] [${f.code}] (${r.slug}) ${f.msg}`);
    }
  }
  process.exit(crit ? 1 : 0);
}
