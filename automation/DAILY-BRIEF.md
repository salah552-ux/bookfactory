# BookFactory Daily Brief — 2026-06-10

---

## ACTION REQUIRED

**6 items need you today.** Most urgent first.

---

**1. VERIFY CATHEDRAL CLOSE PRICE RESTORED TO £6.99** 🔴 NEW TODAY
Countdown Deal (2026-06-02 → 2026-06-09) ended yesterday. KDP auto-restores list price but scraping is blocked — can't confirm. Open amazon.co.uk, search B0GZD1S8HF, check the live price.
- If £6.99 ✓ → update `countdown_deal_run: true` in `books/untitled-cosy-mystery/pipeline-state.json` → reply **PRICE-OK**
- If still discounted ✗ → reply **PRICE-STUCK** (requires KDP support call)

**2. FIX ASIN FIELDS IN BOTH STATE FILES** 🔴 (day 4 unresolved)
Log into KDP dashboard, copy the exact 10-character ASIN for each book.
- Fix Your Gut for Good: `publishing.asin` = `null` → should be real ASIN
- Cathedral Close: `publishing.asin` = `AT25QRT6FPTE6` (13 chars — invalid)
Reply **ASINS-UPDATED** once both state files corrected via agent-log MODE 2.

**3. RECONCILE FIX YOUR GUT STATE FILE** 🔴 (day 4 unresolved — book live 50 days)
State file still shows `kdp_status: "not_started"`, `published: false`, `live_date: null`. Needs:
`kdp_status → "live"`, `live_date → "2026-04-21"`, `published → true`, `ai_questionnaire_confirmed → true`, `kdp_select → true`, `kdp_select_term_end → "2026-07-19"`, `countdown_deal_eligible_from → "2026-05-21"` + correct ASIN.
Reply **RECONCILED** once done.

**4. FIX SCRAPE ACCESS (day 4 blocked)** 🔴
Amazon bot-protection has blocked all automated fetches since 2026-06-07. Zero live metrics. Pick one:
- **Option A (manual):** Check both ASINs in browser each morning, paste BSR + rating + reviews into pipeline-state.json `post_launch` section → reply **MANUAL**
- **Option B (automated):** Set up Keepa API or RainforestAPI key in watchdog env → reply **API**

**5. CATHEDRAL CLOSE POST-LAUNCH STUCK 38 DAYS** 🔴
Stage 10-postlaunch in_progress since 2026-05-03. No ads ever started. No ARC emails sent. 0 reviews. A+ content not live.
Action: invoke `post-launch-agent` + `ams-optimizer-agent` (parallel). If ARC list exists, also run `arc-manager-agent`.
Reply **KICKOFF** to confirm you want these agents triggered.

**6. CATHEDRAL CLOSE CATEGORY — VERIFY OR FIX** 🟡
Current KDP categories: `Cozy > General` + `British & Irish > Contemporary`. `Cozy > General` is low-precision and may hurt discoverability. Log into KDP and confirm.
- If correct → add `category_mismatch_flagged: false` to state file → reply **CAT-OK**
- If wrong → reclassify (e.g. `Cozy > Animal`, `Traditional Detective > British`) → reply **CAT-WRONG**

---

## Live Book Status

Automated scraping has been blocked by Amazon bot-protection for **4 consecutive days** (2026-06-07 through 2026-06-10). No live metrics available. Last recorded values below.

| Book | ASIN | Rating | Reviews | BSR | Price | Last Data |
|------|------|--------|---------|-----|-------|-----------|
| Fix Your Gut for Good | B0GXYLWS1W (watchdog) / null (state) | — | 0 | No baseline | SCRAPE FAILED | 2026-04-19 |
| Death in the Cathedral Close | B0GZD1S8HF (watchdog) / invalid (state) | — | 0 | No baseline | SCRAPE FAILED — verify £6.99 restored | 2026-05-03 |

---

## Upcoming Deadlines (next 14 days)

Nothing hard-fires in the next 14 days.

| Item | Date | Days Away |
|------|------|-----------|
| Fix Your Gut — KDP Select alert fires | 2026-07-05 | 25 days |
| Cathedral Close — next Countdown window opens | 2026-07-09 | 29 days |
| Cathedral Close — KDP Select alert fires | 2026-07-18 | 38 days |
| Fix Your Gut — KDP Select term ends (auto-renews if no action) | 2026-07-19 | 39 days |

---

## Standing Gaps

These repeat every run until resolved.

- **Both books:** `bookfunnel_link_live == false` — lead-magnet funnel not live for either title
- **Cathedral Close:** Category placement unverified (Cozy > General may be too broad)
- **Fix Your Gut:** State file never reconciled 50 days post-launch — all post-launch tracking blind

---

## Intelligence

- **Job 3 (intel-freshness):** report not found for today (runs Mondays)
- **Job 5 (integrity):** report not found for today (runs Sundays)
- **Job 4 (ALGO candidate):** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` not found (runs monthly)

No new intel to action.

---

## All Clear

Nothing is all-clear today. 6 action items open, scrape blind for day 4, one book untracked for 50 days.

---

*Sources: watchdog-2026-06-10.md · milestones-2026-06-10.md · intel-freshness: not found · integrity: not found · ALGO candidate: not found*
*Generated: 2026-06-10*
