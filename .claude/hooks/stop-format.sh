#!/bin/bash
# Stop: batch-format files touched this turn via eslint --fix, then run
# the test suite. Reports lint errors and test failures as context for
# the next turn. Silent on fully clean runs.
cd "$CLAUDE_PROJECT_DIR" || exit 0

ctx=""

# --- Lint: autofix tracked files ---
TRACKER="$CLAUDE_PROJECT_DIR/.claude/.edited_files"

if [[ -f "$TRACKER" ]]; then
  FILES=$(sort -u "$TRACKER" | while read -r f; do [[ -f "$f" ]] && echo "$f"; done)
  rm -f "$TRACKER" 2>/dev/null || true

  if [[ -n "$FILES" ]]; then
    echo "$FILES" | xargs npx eslint --fix 2>/dev/null || true

    LINT_OUTPUT=$(echo "$FILES" | xargs npx eslint 2>&1) || true
    if [[ -n "$LINT_OUTPUT" ]]; then
      TRIMMED=$(echo "$LINT_OUTPUT" | head -20)
      TOTAL=$(echo "$LINT_OUTPUT" | wc -l | tr -d ' ')
      if [[ "$TOTAL" -gt 20 ]]; then
        TRIMMED="${TRIMMED}\n... ($(( TOTAL - 20 )) more lines)"
      fi
      ctx="eslint errors remaining after autofix:\n${TRIMMED}"
    fi
  fi
fi

# --- Tests: always run, ~4s ---
TEST_OUTPUT=$(npm test 2>&1)
TEST_EXIT=$?

if [[ "$TEST_EXIT" -ne 0 ]]; then
  # Extract just the failure summary (last 20 lines), strip ANSI codes
  TAIL=$(echo "$TEST_OUTPUT" | sed 's/\x1b\[[0-9;]*m//g' | tail -20)
  if [[ -n "$ctx" ]]; then
    ctx="${ctx}\n\n"
  fi
  ctx="${ctx}Test failures:\n${TAIL}"
fi

if [[ -n "$ctx" ]]; then
  jq -n --arg ctx "$(printf "$ctx")" \
    '{"hookSpecificOutput": {"hookEventName": "Stop", "additionalContext": $ctx}}' || true
fi

exit 0
