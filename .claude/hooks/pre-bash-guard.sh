#!/bin/bash
# PreToolUse (Bash): block commands that belong to other SDKs or could
# cross-contaminate this JS workspace. Emits a blocking reason if matched.
cd "$CLAUDE_PROJECT_DIR" || exit 0

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

[[ -z "$COMMAND" ]] && exit 0

reason=""

# Block other-SDK toolchains run from this JS project
case "$COMMAND" in
  bundle\ *|gem\ *|ruby\ *|rake\ *)
    reason="Ruby command in JS SDK - wrong directory?" ;;
  pip\ *|python\ *|flake8\ *|pytest\ *|setup.py\ *)
    reason="Python command in JS SDK - wrong directory?" ;;
  go\ test*|go\ build*|go\ run*|go\ install*|golangci-lint\ *)
    reason="Go command in JS SDK - wrong directory?" ;;
  composer\ *|phpunit\ *|php-cs-fixer\ *|phpstan\ *)
    reason="PHP command in JS SDK - wrong directory?" ;;
esac

# Block global installs
case "$COMMAND" in
  npm\ install\ -g*|npm\ i\ -g*|sudo\ npm\ *)
    reason="Global npm install not allowed - use local dependencies" ;;
esac

if [[ -n "$reason" ]]; then
  jq -n --arg reason "$reason" \
    '{"decision": "block", "reason": $reason}' || true
fi

exit 0
