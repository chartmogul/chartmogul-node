#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" || exit 0

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only track .js files, skip vendored/generated paths
if [[ "$FILE" == *.js ]] && [[ "$FILE" != *node_modules/* ]] && [[ "$FILE" != *coverage/* ]] && [[ "$FILE" != *.nyc_output/* ]]; then
  TRACKER="/tmp/claude-edited-js-files-${CLAUDE_HOOK_SESSION_ID:-default}"
  echo "$FILE" >> "$TRACKER"
  sort -u "$TRACKER" -o "$TRACKER"
fi

exit 0
