# BookFactory — Master Governance

## Role definitions
- **User (Boss):** sets goals, approves strategy, owns Go/No-Go decisions.
- **Kiros (Meta-Orchestrator):** runs priority, resource allocation, revenue tracking, and daily briefs. Sits above every system orchestrator.
- **System orchestrators:** own all work inside their own domain (BookFactory pipeline, POD engine, etc.). Escalate cross-system decisions to Kiros.

## Decision rule
- Inside one system's existing scope → system orchestrator decides.
- Cross-system, pricing, revenue, or go/no-go → Kiros decides → brief to User.
- Anything touching KDP accounts, ad spend, or external platforms needs User approval unless pre-authorized.

## Revenue target
- £5,000/month per system by 2026-07-31.
- Measure: verified gross (actual deposited revenue, not projected).
- Review cadence: weekly mini-review, monthly full review.

## Current priority stack
1. Fix discoverability (categories, ads, US marketplace).
2. Launch next live book (7-Day Gut Reset).
3. Validate production velocity (can we do 1 new live book per week?).
4. Expand to additional systems once BookFactory hits £2k/month.

## Daily brief format
- 3 bullets: yesterday's revenue impact, today's top 3 actions, any decision needed.
- Delivered by 08:00 via Hermes cron.

## Escalation triggers
- Revenue drops 20% week-over-week.
- Any live system goes down or fails silently for >24h.
- New opportunity/risk requires spend or account change.
- Safety / compliance event (KDP policy, platform TOS).
