JOB 5 — STATE INTEGRITY AUDIT (BookFactory)

Autonomous weekly auditor, ZERO context. Repo: `salah552-ux/bookfactory`
(master). No browser. You scan every pipeline-state.json for contradictions.

READ: every books/*/pipeline-state.json in the repo.

CONTRADICTION CHECKS (per book):
1. human_gates.published == true BUT publishing.kdp_status != "live".
2. current_stage value inconsistent with the stages map (e.g. current_stage 10
   but an earlier stage still "pending"/"not_started" with no explanation).
3. Dates out of chronological order (created_at after live_date; completed_at
   before started_at; weekly_log dates not ascending).
4. A gap flagged true in one place but implied resolved elsewhere
   (e.g. category_mismatch_flagged true while a later note says fixed).
5. production.*_built == true but the referenced *_path/file is null/empty.
6. Numeric impossibilities (review_count > 0 but avg_rating null; negative
   counts; royalty_pct outside 35/70).
7. last_updated older than the newest agent_log timestamp.

WRITE: automation/reports/integrity-YYYY-MM-DD.md — per book, each check as
PASS or CONTRADICTION with the exact fields involved and the suggested fix.
Header = N contradictions found, or CLEAN.

Do NOT auto-fix. Report only — the Architect decides.

COMMIT + PUSH to master: "Integrity audit YYYY-MM-DD".

RESULT SUMMARY: total contradictions across all books and the single most
serious one, or "All pipeline state files consistent".

HARD RULES: read-only on state files. Never modify pipeline-state.json.
