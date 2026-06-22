# BookFactory Daily Brief — 2026-06-22

---

## ACTION REQUIRED — 6 items needing a decision

### 🔴 1. PRICE — Cathedral Close, post-Countdown-Deal (Day 13 — REVENUE RISK)
Countdown Deal ended **2026-06-09**. Whether the price restored to £6.99 has **never been verified** — 13 days of sales at an unknown price. 5-minute fix.
> Open amazon.co.uk → search `B0GZD1S8HF` → confirm £6.99 is live. If not, fix in KDP → Pricing.
> Then reply **PRICE-CONFIRMED** (or describe what you found) to clear this alert.

### 🔴 2. MISSING FILES — Cathedral Close EPUB + cover may be gone
`pipeline-state.json` says EPUB and cover are at `books/untitled-cosy-mystery/exports/final/` — that directory does not exist on disk. If KDP ever needs a re-upload or cover replacement, you have no source files.
> Find the EPUB and cover (check `exports/`, `build/`, or any local drive backup). Restore to expected path, or update state file paths.
> Reply **FILES-FOUND** once located.

### 🔴 3. ASINs — Both books have bad/missing ASINs in state files (Day 15)
| Book | State file says | Problem |
|------|----------------|---------|
| Fix Your Gut for Good | `null` | Book treated as unpublished by all automation |
| Death in Cathedral Close | `AT25QRT6FPTE6` | 13 characters — not a valid Amazon ASIN (must be 10) |

> Log into KDP Bookshelf → copy exact 10-char ASIN for each title → update both `pipeline-state.json` files.
> Reply **ASINS-FIXED** to clear.

### 🔴 4. MONITORING BLIND — Amazon blocking all scrapes (Day 15, 10/10 consecutive failures)
Every automated watchdog run since 2026-06-07 has returned 403. No live metrics for either book. Pick one:
- **Option A (5 min):** Check both ASINs in browser; paste current BSR, rating, review count into each `pipeline-state.json`. Watchdog will use these as baseline.
- **Option B:** Add `RAINFOREST_API_KEY` or `KEEPA_API_KEY` to environment — watchdog switches automatically.
- **Option C:** Keepa Chrome extension → export BSR history for both ASINs as one-off baseline.
> Reply **MONITOR-A**, **MONITOR-B**, or **MONITOR-C** to choose path.

### 🟡 5. POST-LAUNCH — Cathedral Close stuck at Day 50, nothing running
Stage 10-postlaunch has been `in_progress` since launch with zero recorded agent activity. **0 reviews, 0 ARC emails sent, ads inactive.** This book is flying blind.
> Run `post-launch-agent` + `arc-manager-agent` + `amazon-ads-agent` for slug `untitled-cosy-mystery`.
> Reply **POSTLAUNCH-GO** to authorise.

### 🟡 6. KDP SELECT — Fix Your Gut renewal due 2026-07-19 (27 days)
KDP Select term ends in 27 days. Auto-renews unless you opt out. Decide: stay in KU, or go wide (Apple Books, Kobo, etc.)?
> Reply **RENEW-KU** or **GO-WIDE** to log the decision.

---

## Live Book Status

Amazon scraping has been **100% blocked** for 15 days. No live metrics exist. Last known values:

| Book | Reviews | Avg Rating | BSR | Price status |
|------|---------|-----------|-----|-------------|
| Fix Your Gut for Good (B0GXYLWS1W) | 0 (last recorded 2026-04-19) | n/a | no baseline | Unknown |
| Death in Cathedral Close (B0GZD1S8HF) | 0 (last recorded 2026-05-03) | n/a | no baseline | **🔴 Unverified post-deal** |

*Note: 5-day gap in watchdog reports (06-17 → 06-21) — check automated scheduling.*

---

## Upcoming Deadlines (next 14 days)

| Date | Item |
|------|------|
| 2026-07-05 | KDP Select renewal window opens for Fix Your Gut (act before 2026-07-19) |
| **Overdue** | post-launch-agent for Cathedral Close (50 days in, should have run weekly) |
| **Overdue** | ARC programme for Cathedral Close (0 emails sent, 0 reviews) |

---

## Standing Gaps (unresolved across multiple runs)

| Gap | Book(s) | Status |
|-----|---------|--------|
| No BookFunnel capture link live | Both books | Unresolved — email list has zero captures |
| Category mismatch possible (Cozy > General placement) | Cathedral Close | Unverified — check KDP category dashboard |
| `fix-your-gut` pipeline-state.json 64 days stale | Fix Your Gut | Stage 07 shows `not_started` despite live 2026-04-21 |
| Cover file path null (cover_approved = true) | Fix Your Gut | `production.cover_file` unpopulated |
| Chapter count wrong (1 recorded, 3 completed) | The Dust Between Seconds | Needs `agent-log MODE 2` correction |

---

## Intelligence

All **3 niches are STALE** (no fresh harvests). Must run from your local terminal — cloud cannot execute harvests directly.

| Niche | Last harvest | Age |
|-------|-------------|-----|
| gut-health | 2026-05-13 | 40 days |
| cozy-mystery | 2026-06-01 | 21 days |
| vagus-nerve | 2026-06-03 | 19 days |

```bash
harvest gut-health ; analyse opportunities gut-health
harvest cozy-mystery ; analyse opportunities cozy-mystery
harvest vagus-nerve ; analyse opportunities vagus-nerve
```

**ALGO-INTELLIGENCE-CANDIDATE.md** — not found. No new algo candidate this cycle.

---

## All Clear

Nothing is all clear today. Six action items open; two are revenue-critical.

---

*Sources: watchdog-2026-06-22.md · milestones-2026-06-22.md · intel-freshness-2026-06-22.md · integrity-2026-06-21.md (yesterday — weekly run) · No ALGO-INTELLIGENCE-CANDIDATE found.*
*Brief generated: 2026-06-22*
