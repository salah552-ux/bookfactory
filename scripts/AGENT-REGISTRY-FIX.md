# Agent Registry Fix — 6 BookFactory agents not dispatchable

**Date:** 2026-06-29
**Branch:** system-hardgate-fixes

## The bug
6 of 55 BookFactory agents could not be spawned (the harness rejected their
`subagent_type`), despite the files existing:

1. kdp-upload-agent  (07-publishing)  ← blocked the live KDP upload hand-off
2. analyzer-agent    (00-intelligence)
3. harvester-agent   (00-intelligence)
4. intelligence-orchestrator-agent (00-intelligence)
5. niche-finder-agent (00-intelligence)
6. opus-brain-agent  (00-intelligence)

## ROOT CAUSE (proven)
**Malformed YAML frontmatter.** Each of the 6 had an UNQUOTED `description:` whose text
contained a colon-space (`": "`), e.g. kdp-upload: "...Covers: AI questionnaire...",
harvester: '...Invoke with: "harvest ..."'. In YAML a bare scalar with `": "` is parsed
as a nested mapping, so the frontmatter fails to parse — and Claude Code then **silently
drops** the agent from the registry. A parse check isolated EXACTLY these 6 of 55 and
none of the 49 working agents (perfect correlation).

A false lead first: I suspected registry overflow from ~76 enabled plugins and trimmed
them — it did NOT help (the 6 stayed missing), which disproved the capacity theory and
pointed to the per-file parse failure. Plugins were restored to the original 76.

## The fix applied
1. Quoted the `description:` value (double-quoted, escaped) in all 6 agents, in BOTH
   the project source `.claude/agents/<stage>/<name>.md` AND the user-level copies
   `~/.claude/agents/bf-*.md`. (12 files.) Verified: 0/55 unparseable afterward.
2. Hardened `scripts/sync-agents-to-user.py` with `harden_frontmatter()` — it now
   auto-quotes any unquoted description on every sync, so a future colon-space
   description can't silently drop an agent again.
3. Restored `~/.claude/settings.json` to the original 76 plugins (the trim was a wrong
   hypothesis). Backup kept at `~/.claude/settings.json.bak-20260629-180420`.

## ⚠ Verification REQUIRES a Claude Code restart
The agent registry is built at startup; the fix only takes effect on a fresh launch.
After restarting, ask "verify the agent registry" — the assistant probes the available
agent list and confirms all 6 (kdp-upload-agent, analyzer-agent, harvester-agent,
intelligence-orchestrator-agent, niche-finder-agent, opus-brain-agent) now register.

## Lesson for the system (hardgate)
Unquoted descriptions are the silent-drop trap. The sync script now defends against it.
If you ever hand-add an agent, keep `description:` quoted OR re-run the sync.
