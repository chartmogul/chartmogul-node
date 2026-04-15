#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE" == *.js ]]; then
  npx eslint --fix "$FILE" 2>/dev/null
fi

exit 0
