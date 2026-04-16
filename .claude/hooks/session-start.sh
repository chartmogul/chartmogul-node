#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" || exit 0

# Generate a stable session ID and persist via CLAUDE_ENV_FILE
# so the edit tracker and stop hook share the same file path
SESSION_ID="$(date +%s)-$$"
if [[ -n "$CLAUDE_ENV_FILE" ]]; then
  echo "export CLAUDE_HOOK_SESSION_ID='$SESSION_ID'" >> "$CLAUDE_ENV_FILE"
fi

ctx=""

# Warn if package-lock.json is missing or stale
if [[ ! -f package-lock.json ]]; then
  ctx+="package-lock.json missing - run npm install.\n"
elif [[ package.json -nt package-lock.json ]]; then
  ctx+="package-lock.json is stale - run npm install before testing.\n"
fi

# Warn if node_modules is missing
if [[ ! -d node_modules ]]; then
  ctx+="node_modules missing - run npm install.\n"
fi

# Warn about uncommitted changes
dirty=$(git diff --name-only 2>/dev/null | head -5)
if [[ -n "$dirty" ]]; then
  ctx+="Uncommitted changes:\n$dirty\n"
fi

# Report current branch
branch=$(git branch --show-current 2>/dev/null)
if [[ -n "$branch" ]]; then
  ctx+="Branch: $branch\n"
fi

if [[ -n "$ctx" ]]; then
  jq -n --arg ctx "$ctx" '{
    "hookSpecificOutput": {
      "hookEventName": "SessionStart",
      "additionalContext": $ctx
    }
  }'
fi

exit 0
