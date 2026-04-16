#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" || exit 0

TRACKER="/tmp/claude-edited-js-files-${CLAUDE_HOOK_SESSION_ID:-default}"

ctx=""

# Batch eslint autocorrect on tracked files (if any were edited)
if [[ -f "$TRACKER" ]]; then
  files=$(cat "$TRACKER")
  rm -f "$TRACKER"

  if [[ -n "$files" ]]; then
    echo "$files" | xargs npx eslint --fix 2>/dev/null || true
    lint_out=$(echo "$files" | xargs npx eslint 2>&1) || true
    offenses=$(echo "$lint_out" | grep -E "^\s+[0-9]+:[0-9]+\s+" | head -20)
    if [[ -n "$offenses" ]]; then
      ctx+="eslint offenses remaining after autofix:\n$offenses\n"
    fi
  fi
fi

# Always run tests (~4s)
test_out=$(npm test 2>&1)
test_exit=$?
if [[ $test_exit -ne 0 ]]; then
  summary=$(echo "$test_out" | sed 's/\x1b\[[0-9;]*m//g' | grep -E "[0-9]+ (passing|failing)" | tail -2)
  failed=$(echo "$test_out" | sed 's/\x1b\[[0-9;]*m//g' | grep -E "^\s+[0-9]+\)" -A 5 | head -20)
  ctx+="npm test failed ($summary):\n$failed\n"
fi

if [[ -n "$ctx" ]]; then
  jq -n --arg ctx "$ctx" '{
    "hookSpecificOutput": {
      "hookEventName": "Stop",
      "additionalContext": $ctx
    }
  }'
fi

exit 0
