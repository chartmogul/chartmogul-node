#!/bin/bash
# PostToolUse (Bash, scoped to git commit): lint files in the just-created
# commit and report failures back as context. Does not run tests.
cd "$CLAUDE_PROJECT_DIR" || exit 0

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only fire on git commit commands
case "$COMMAND" in
  git\ commit*) ;;
  *) exit 0 ;;
esac

# Get .js files changed in the last commit
FILES=$(git diff-tree --no-commit-id --name-only -r HEAD -- '*.js' 2>/dev/null)
[[ -z "$FILES" ]] && exit 0

# Lint only those files
LINT_OUTPUT=$(echo "$FILES" | xargs npx eslint 2>&1) || true

if [[ -n "$LINT_OUTPUT" ]]; then
  # Truncate to ~20 lines
  TRIMMED=$(echo "$LINT_OUTPUT" | head -20)
  REMAINING=$(echo "$LINT_OUTPUT" | wc -l)
  if [[ "$REMAINING" -gt 20 ]]; then
    TRIMMED="${TRIMMED}\n... ($(( REMAINING - 20 )) more lines)"
  fi
  jq -n --arg ctx "eslint errors in committed files:\n${TRIMMED}" \
    '{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": $ctx}}' || true
fi

exit 0
