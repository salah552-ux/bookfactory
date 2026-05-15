# POST-LAUNCH-DATA.json — agent → UI contract

After launch, `post-launch-agent` and `ams-optimizer-agent` should write a single artefact at:

```
books/<slug>/POST-LAUNCH-DATA.json
```

The frontend reads this file on the post-launch stage (`/books/<slug>/stage/10-postlaunch`) and renders the four chart panels. Any series that's missing falls back to a "no data yet" placeholder.

## Schema

```jsonc
{
  // ISO 8601 timestamp of the most recent emit. Optional but recommended.
  "generated_at": "2026-06-12T14:00:00Z",

  // Best Seller Rank over time. Day labels can be ISO dates or "Day N".
  // Reverse-axis is handled by the UI (lower BSR = better).
  "bsr": [
    { "day": "2026-06-01", "bsr": 18420 },
    { "day": "2026-06-02", "bsr": 12100 }
  ],

  // Daily review count + rolling average rating.
  "reviews": [
    { "day": "2026-06-01", "reviews": 0,  "rating": 0   },
    { "day": "2026-06-05", "reviews": 6,  "rating": 4.5 },
    { "day": "2026-06-12", "reviews": 23, "rating": 4.6 }
  ],

  // One row per AMS campaign. Spend in USD (or your reporting currency).
  // ACoS as a percentage (35 means 35%).
  "ams": [
    { "campaign": "Auto-All",      "spend": 84.20, "acos": 28 },
    { "campaign": "Manual-Broad",  "spend": 41.10, "acos": 42 },
    { "campaign": "Manual-Exact",  "spend": 36.50, "acos": 22 },
    { "campaign": "ASIN-Targeting","spend": 24.80, "acos": 31 }
  ],

  // Kindle Unlimited page reads per day.
  "ku": [
    { "day": "2026-06-01", "pages": 0     },
    { "day": "2026-06-05", "pages": 1240  },
    { "day": "2026-06-12", "pages": 4180  }
  ]
}
```

## Update cadence

- `post-launch-agent` runs weekly for the first 30 days, then monthly. It owns `bsr`, `reviews`, `ku`.
- `ams-optimizer-agent` runs weekly. It owns `ams`.
- Both should merge into the same JSON file (read → patch → write), preserving the other agent's keys.

## File watcher

The backend watches `books/<slug>/` with chokidar. As soon as either agent rewrites the file, the frontend gets `file.changed` and re-reads the artefact automatically — no refresh needed.

## Atomic writes

Use a temp-file-and-rename pattern in agent prompts to avoid the UI reading a half-written file:

```bash
jq --argjson new "$NEW_PAYLOAD" '. * $new' POST-LAUNCH-DATA.json > .tmp.json
mv .tmp.json POST-LAUNCH-DATA.json
```
