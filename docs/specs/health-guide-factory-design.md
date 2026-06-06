# Health Guide Factory — Design Spec
Date: 2026-05-11

## What We're Building
A fully automated daily factory that produces standalone health protocol guides (4,000–6,000 words) and publishes them to KDP. Volume play — as many as possible, agent runs daily.

## Product Format
- Length: 4,000–6,000 words
- Price: Ladder strategy (see below)
- KU enrolled (KDP Select — enables free days)
- Format: Ebook + Paperback
- Niche: Health (gut, detox, inflammation, hormones, recovery)
- Template structure (locked — same every time):
  1. Hook — why the reader is stuck
  2. Root cause (1 page, not a lecture)
  3. The Protocol — what to do
  4. Day-by-day plan
  5. What to expect (timeline + symptoms)
  6. FAQ

## Architecture

```
Intelligence Layer (weekly)
    ↓ harvests real BSR data
    ↓ Opus brain ranks topics by opportunity score
    ↓ updates topic-queue.txt
        ↓
Factory Agent (daily — Windows Task Scheduler)
    ↓ reads next unprocessed topic from queue
    ↓ writes full guide using locked template
    ↓ Pandoc → EPUB + DOCX
    ↓ KDP upload
        ↓
Live on Amazon
```

## Key Files to Build (next session)
1. `BookFactory/intelligence/topic-queue.txt` — 100 validated titles, one per line, marked processed/pending
2. `BookFactory/.claude/agents/00-intelligence/queue-manager-agent.md` — updates queue from intelligence reports
3. `BookFactory/.claude/agents/01-guide-factory/guide-factory-agent.md` — full-auto: topic in → published guide out
4. `BookFactory/scripts/run-factory.bat` — Windows Task Scheduler entry point

## Scheduling
- Windows Task Scheduler (free, local, reliable) — NOT CCR remote routines
- Runs daily at a set time
- Calls: `claude --print "Run guide-factory-agent"`

## Intelligence Integration
- Intelligence layer runs weekly (manual trigger for now)
- Outputs ranked topic list → queue-manager-agent updates topic-queue.txt
- Factory never picks an unvalidated topic
- Topics with opportunity score < 40 are skipped automatically

## Topic Bank (seed list — validate with intelligence before building)
### Gut / Digestive
- The 7-Day Gut Reset
- Heal Your Gut After Antibiotics: 14-Day Protocol
- How to Stop Bloating in 5 Days
- Restore Your Gut Terrain in 30 Days
- The SIBO Starter Protocol
- How to Repair Leaky Gut Fast
- The Candida Cleanse Protocol
- The 10-Day Gut Detox
- How to Reset Your Microbiome
- The Post-Antibiotic Gut Repair Guide

### Liver / Detox
- The 10-Day Liver Detox Protocol
- The Gentle Liver Flush Guide
- 7-Day Body Detox Plan
- The Morning Detox Protocol
- How to Support Your Liver Naturally

### Inflammation
- The 3-Day Inflammation Reset
- Anti-Inflammatory Diet in 7 Days
- How to Calm Your Body in 30 Days
- The Inflammation Protocol: A Beginner's Guide
- How to Reduce Chronic Inflammation Fast

### Energy / Adrenals / Hormones
- How to Reset Your Adrenals in 30 Days
- The Cortisol Reset Protocol
- Restore Your Energy in 14 Days
- How to Fix Hormonal Bloating
- The Thyroid Support Protocol

### Specific Recovery Triggers
- Heal Your Gut After Food Poisoning
- The Post-COVID Gut Reset
- How to Detox After a Course of Antibiotics
- The Stress Gut Protocol
- How to Recover Your Digestion After Surgery

## Pricing Strategy — Ladder Model
Every guide follows this sequence. Tracked in a phase file per guide.

| Phase | Price | Trigger to advance |
|-------|-------|--------------------|
| Launch | FREE (5 KDP free days) | BSR spike + downloads |
| Phase 1 | £0.99 | 3+ reviews |
| Phase 2 | £1.99 | BSR < 50,000 + 10 reviews |
| Phase 3 | £2.99 | BSR stable 30 days |

- 70% royalty kicks in at £2.99 (~£2.09/sale)
- Intelligence layer monitors BSR weekly → triggers price raise automatically
- All 5 free days used at launch (not spread out)

## Additional Design Decisions (2026-05-11)
- **Pen name**: Separate from Fix Your Gut for Good brand — to be decided before factory builds
- **Cover template**: One locked design, title swapped per guide — must be built before factory runs
- **Phase tracker**: JSON file per guide tracking current price phase + metrics

## Status
DESIGN AGREED — 2026-05-11. Not built yet.
Next session: build files listed above + populate full 100-title topic bank using intelligence data.
