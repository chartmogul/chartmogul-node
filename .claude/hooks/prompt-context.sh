#!/bin/bash
# UserPromptSubmit: inject dynamic workspace context into the model's context.
# Shows current branch, uncommitted file count, and lockfile staleness.
cd "$CLAUDE_PROJECT_DIR" || exit 0

ctx=""

# Current branch
branch=$(git branch --show-current 2>/dev/null || echo "unknown")
ctx="Branch: ${branch}"

# Uncommitted changes summary
changed=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
staged=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
if [[ "$changed" -gt 0 || "$staged" -gt 0 ]]; then
  ctx="${ctx} | Unstaged: ${changed}, Staged: ${staged}"
fi

# Lockfile freshness
if [[ -f package.json && -f package-lock.json ]]; then
  if [[ package.json -nt package-lock.json ]]; then
    ctx="${ctx} | WARNING: package-lock.json is stale"
  fi
fi

# Pending lint errors from last turn (leftover tracker means stop hook didn't run)
TRACKER="$CLAUDE_PROJECT_DIR/.claude/.edited_files"
if [[ -f "$TRACKER" ]]; then
  pending=$(sort -u "$TRACKER" | wc -l | tr -d ' ')
  ctx="${ctx} | ${pending} edited file(s) not yet lint-checked"
fi

jq -n --arg ctx "$ctx" \
  '{"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext": $ctx}}' || true

exit 0
