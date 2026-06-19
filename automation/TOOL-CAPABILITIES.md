# MCP Tool Capabilities — what each tool can and can't do for BookFactory

Investigated and built 2026-06-07 by the master orchestrator (Opus).
This is the honest map of every connected MCP so future sessions don't
re-discover the same limits.

---

## Gmail MCP

**Can do:**
- Search the inbox with full Gmail query syntax (`search_threads`), read full bodies (`get_thread`).
- Create draft emails ready to send (`create_draft`) — used for the ARC outreach drafts.
- Create/apply labels (`create_label`, `label_thread`) — created `BookFactory/KDP-Alerts` (Label_11) and `BookFactory/ARC-Outreach` (Label_12).

**Cannot do / hard limits:**
- **KDP sends NO per-sale and NO per-review emails.** Verified: the inbox has zero KDP sales/royalty/review notifications going back years. Sales + KENP + review counts live ONLY behind the KDP login. So a "Gmail → sales data" bridge is impossible by design — the data never enters email.
- What KDP *does* email (and Job 7 now catches): monthly royalty/payment, KDP Select term notices, content/policy/blocked-listing notices, ads billing. These are rare but some are urgent.
- Cannot send mail autonomously here — only drafts. Sending stays a human action (correct for outreach).
- The `to` field needs plain addresses; the `Name <addr>` format is rejected.

**Now wired into:** Job 7 (KDP inbox scan), Job 8 (secondary review-mail check).

---

## Google Drive MCP

**Can do:**
- Create files/folders, push verbatim text content (`create_file` with `textContent` + `disableConversionToGoogleType`), search, read.
- Created the **BookFactory** backup folder (`1U6bceYXMcb3gMufzJwM1j0w0eVJieEK4`).

**Cannot do / limits:**
- No native "sync a local folder" — backup = re-pushing dated copies each run.
- The local UberReflex working dir is sandboxed off the network (uv/python downloads blocked), so the robust backup runs from the **cloud** Job 7 (which has the full repo cloned + Drive MCP), not from this local session.

**Now wired into:** Job 7 backs up all three `pipeline-state.json` + manifest + DAILY-BRIEF to Drive weekly as dated verbatim copies → off-machine, any-device access + version history.

---

## Canva MCP

**Can do:**
- Search existing designs (`search-designs`), generate new ones from a prompt (`generate-design` → candidates → `create-design-from-candidate`), organise into folders, move items.
- Found pre-existing BookFactory designs: "First/Second/Third KDP Book Cover", "Poster - Heal Your Gut" (created ~Apr 2026).
- Built this session: 2 reusable Instagram promo templates (1 per live book) + the Wychford Close Companion reader-magnet cover, all filed in folder **BookFactory — Social Templates** (`FAHL6MHCkUk`).

**Cannot do / limits / gap:**
- **No brand kit exists** (`list-brand-kits` returns empty). Without one, `generate-design` can't auto-apply the locked palette/fonts (Playfair Display, navy #1b3a5c, tan #c8b99a) — it only follows the prompt text. **Recommendation: build a Canva brand kit from design_style_locked.md** so every future generation is on-brand automatically.
- Generation returns AI candidates that vary; a human should review/refine the editable design before publishing.

**Asset registry:**
| Asset | Design ID | Edit link |
|---|---|---|
| Cathedral Close — IG promo | DAHL6PpOgsQ | canva.com/d/Oab1IT-vz6zGhNG |
| Fix Your Gut — IG promo | DAHL6FGjkn8 | canva.com/d/1WqJ_NUWUPt5AQm |
| Wychford Close Companion — cover | DAHL6aRTmi0 | canva.com/d/1RG2eqxq7Gn0-X5 |

---

## RemoteTrigger (CCR)

**Can do:** list/get/create/update/run cloud cron agents. Cloud agents clone the
GitHub repo per run and can have MCP connectors attached (Gmail, Drive, Canva,
Adobe, PDF).

**Gotchas learned this session:**
- `update` requires the FULL `job_config.ccr` incl. `environment_id` + `session_context` (sources, allowed_tools, model) — a partial body 400s.
- `mcp_connections` is a **top-level** field of the trigger body, NOT inside `job_config` (putting it inside 400s with "unknown field").
- Cron is interpreted in **UTC**.
- Cloud agents **cannot** log into KDP (login + 2FA) — public Amazon pages only.

---

## Adobe for Creativity / Adobe Marketing / PDF Viewer MCPs

Connected to the CCR environment but **not yet used** by any job. Opportunities:
- Adobe image tools (background removal, generative expand, vectorize, presets)
  could produce A+ Content module images and ad creative from the cover art.
- PDF Viewer could let a cloud job visually QA built book PDFs.
Flagged for a future session — no current job depends on them.

---

## Playwright MCP

Local browser control. The ONLY path to logged-in KDP data (sales, KENP, ads
reports, category edits, price changes). Stays a **local** human-supervised
session — never a cloud job — because of login + 2FA and the publish/spend gates.
