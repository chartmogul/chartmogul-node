#!/bin/bash
# SessionStart: idempotent workspace check (<1s, no network).
# Warns about stale lockfiles and uncommitted changes.
cd "$CLAUDE_PROJECT_DIR" || exit 0

warnings=""

# Check if package-lock.json is newer than package.json (stale deps)
if [[ -f package.json && -f package-lock.json ]]; then
  if [[ package.json -nt package-lock.json ]]; then
    warnings="${warnings}package.json is newer than package-lock.json - run npm install\n"
  fi
fi

# Check for node_modules existence
if [[ ! -d node_modules ]]; then
  warnings="${warnings}node_modules missing - run npm install\n"
fi

# Check for uncommitted changes
if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
  : # clean
else
  branch=$(git branch --show-current 2>/dev/null || echo "unknown")
  warnings="${warnings}Uncommitted changes on branch: ${branch}\n"
fi

if [[ -n "$warnings" ]]; then
  jq -n --arg ctx "$(printf "$warnings")" \
    '{"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": $ctx}}' || true
fi

exit 0
