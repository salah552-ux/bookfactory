#!/usr/bin/env python3
"""
sync-agents-to-user.py — make BookFactory's pipeline agents invokable from ANY workspace.

Run this whenever you change/add an agent in BookFactory/.claude/agents/:
    python scripts/sync-agents-to-user.py

WHY:
  Claude Code loads sub-agents only from (a) the PRIMARY workspace's .claude/agents/,
  (b) ~/.claude/agents/ — FLAT ONLY; nested subfolders are NOT loaded — and (c) plugins.
  BookFactory's agents live in BookFactory/.claude/agents/<stage>/, so from a
  non-BookFactory (e.g. UberReflex) session they are un-spawnable. Adding the folder
  to settings.json permissions.additionalDirectories grants FILE ACCESS only; it never
  registers agents (that was the recurring false fix). This flattens the real agents
  into ~/.claude/agents/ so health-writer, book-reviewer, kdp-upload-agent,
  pipeline-orchestrator, etc. become invokable everywhere.

  Canonical source of truth stays BookFactory/.claude/agents/. Synced files are
  prefixed 'bf-' and fully regenerated each run. NEVER hand-edit the bf- copies.
  Re-run this script after editing an agent so the user-level copy stays fresh.
"""
import os
import re
import shutil
import sys

BF = r"C:\Users\salah\BookFactory\.claude\agents"
DST = r"C:\Users\salah\.claude\agents"
PREFIX = "bf-"

NAME_RE = re.compile(r"(?m)^name:\s*(\S.*?)\s*$")
DESC_RE = re.compile(r"(?m)^description:\s*\S")


def harden_frontmatter(content):
    """Ensure the YAML frontmatter `description:` is a quoted scalar.

    A bare (unquoted) description containing a colon-space (e.g. 'Covers: AI ...')
    makes the YAML frontmatter fail to parse, and Claude Code then SILENTLY drops
    the agent from the registry. This bit 6 agents (incl. kdp-upload-agent). Quoting
    the value makes it parse-safe regardless of its punctuation.
    """
    lines = content.split("\n")
    if not lines or lines[0].strip() != "---":
        return content
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return content
    for i in range(1, end):
        if lines[i].startswith("description:"):
            val = lines[i][len("description:"):].strip()
            if val and val[0] not in ('"', "'"):
                esc = val.replace("\\", "\\\\").replace('"', '\\"')
                lines[i] = 'description: "' + esc + '"'
            break
    return "\n".join(lines)


def agent_name(path):
    """Return the frontmatter agent name if this file is a real agent, else None."""
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            head = f.read(1200)
    except Exception:
        return None
    if not head.lstrip().startswith("---"):
        return None
    m = NAME_RE.search(head)
    if not m or not DESC_RE.search(head):
        return None
    return m.group(1).strip()


def main():
    if not os.path.isdir(BF):
        print("[sync-agents] BookFactory agents dir not found:", BF)
        return 1
    os.makedirs(DST, exist_ok=True)

    # 1) prune previously-synced files so renames/deletions don't leave stragglers
    for fn in os.listdir(DST):
        if fn.startswith(PREFIX) and fn.endswith(".md"):
            try:
                os.remove(os.path.join(DST, fn))
            except Exception:
                pass

    # 2) flatten current agents, dedupe by frontmatter name (first wins)
    seen = {}
    skipped_dupes = []
    count = 0
    for root, _dirs, files in os.walk(BF):
        stage = os.path.basename(root)
        for fn in sorted(files):
            if not fn.endswith(".md"):
                continue
            src = os.path.join(root, fn)
            name = agent_name(src)
            if name is None:
                continue  # guide/rubric/non-agent doc — skip
            if name in seen:
                skipped_dupes.append("{} (dup of {})".format(os.path.join(stage, fn), seen[name]))
                continue
            seen[name] = os.path.join(stage, fn)
            with open(src, "r", encoding="utf-8", errors="replace") as f:
                content = harden_frontmatter(f.read())
            dstname = "{}{}-{}".format(PREFIX, stage, fn)
            with open(os.path.join(DST, dstname), "w", encoding="utf-8") as f:
                f.write(content)
            count += 1

    print("[sync-agents] mirrored {} agents -> {}".format(count, DST))
    if skipped_dupes:
        print("[sync-agents] skipped {} duplicate-name file(s): {}".format(len(skipped_dupes), ", ".join(skipped_dupes)))
    print("[sync-agents] agents are invokable from the NEXT session start (any workspace).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
