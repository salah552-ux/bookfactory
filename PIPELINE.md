# THE PUBLISHING PIPELINE
## Your Complete Book Factory — Master Guide

---

## THE SYSTEM

```
YOUR IDEA (1 sentence)
        ↓
[1] market-researcher   → validates niche, finds gap, green/yellow/red signal
        ↓ GREEN
[2] book-architect      → full blueprint, tone bible, chapter outline
        ↓ blueprint
[3] WRITER (pick one)
    health-writer       → health, wellness, gut, hormones, mental health
    fiction-writer      → fantasy, thriller, romance, sci-fi, historical, YA
    business-writer     → business, self-help, productivity, finance
        ↓ raw chapters
[4] book-reviewer       → 12-metric scorecard, grade A/B/C/F, exact fixes
        ↓ grade A or B
[5] design-agent        → interior formatting, typography, cover brief
        ↓
[6] marketing-agent     → launch plan, AMS ads, BookTok scripts, 90-day plan
        ↓
[7] publisher-agent     → KDP listing: title, description, keywords, categories
        ↓
📦 UPLOAD TO KDP
```

---

## HOW TO TRIGGER EACH STAGE

| Say this... | Does this... |
|-------------|-------------|
| `research [idea]` | Runs market-researcher |
| `architect [book title]` | Runs book-architect |
| `write chapter [X] health` | Writes chapter using health-writer |
| `write chapter [X] fiction` | Writes chapter using fiction-writer |
| `write chapter [X] business` | Writes chapter using business-writer |
| `review chapter [X]` | Runs book-reviewer (12 metrics) |
| `design [book title]` | Runs design-agent |
| `market [book title]` | Runs marketing-agent |
| `publish [book title]` | Runs publisher-agent |

---

## ACTIVE BOOKS

| Book | Genre | Blueprint | Chapters Written | Next Step |
|------|-------|-----------|-----------------|-----------|
| Fix Your Gut for Good | Health/SIBO | ✅ Done | Introduction, Ch. 1 | Write Ch. 2 |
| The Dust Between Seconds | Fantasy | ✅ Done | Ch. 3 | Write Ch. 1 & 2 |

---

## FOLDER STRUCTURE

```
BookFactory/
├── PIPELINE.md                          ← you are here
├── .claude/agents/                      ← all agent configs
│
└── books/
    ├── fix-your-gut-for-good/
    │   ├── BLUEPRINT.md                 ← structure, tone bible, chapter plan
    │   ├── manuscript/
    │   │   ├── 00-introduction.md       ✅
    │   │   ├── 01-chapter-1.md          ✅
    │   │   ├── 02-chapter-2.md          ⬜
    │   │   └── ...
    │   └── exports/                     ← PDFs go here
    │
    └── the-dust-between-seconds/
        ├── BLUEPRINT.md
        ├── manuscript/
        │   ├── 01-chapter-1.md          ⬜
        │   ├── 02-chapter-2.md          ⬜
        │   └── 03-chapter-3.md          ✅
        └── exports/
```

---

## EXTERNAL TOOLS NEEDED

| Tool | Purpose | Cost |
|------|---------|------|
| Canva (free tier) | Book covers from design brief | Free |
| Midjourney | AI cover art | ~$10/mo |
| KDP Account | Upload and sell | Free |
| Publisher Rocket | Verify keyword volumes | ~$97 one-time |
