#!/usr/bin/env bash
set -euo pipefail

# ─── Usage ──────────────────────────────────────────────────────────────────────

usage() {
  echo "Usage: bin/release.sh <patch|minor|major>"
  exit 1
}

[[ $# -eq 1 ]] || usage

BUMP_TYPE="$1"
case "$BUMP_TYPE" in
  patch|minor|major) ;;
  *) usage ;;
esac

# ─── Prerequisites ──────────────────────────────────────────────────────────────

for cmd in git gh jq node npm; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: '$cmd' is required but not found on PATH." >&2
    exit 1
  fi
done

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

# ─── Check main CI is green ─────────────────────────────────────────────────────

echo "Checking CI status on main..."
LAST_RUN=$(gh run list --branch main --workflow test.yml --limit 1 --json conclusion,url)
CONCLUSION=$(echo "$LAST_RUN" | jq -r '.[0].conclusion // empty')
RUN_URL=$(echo "$LAST_RUN" | jq -r '.[0].url // empty')

if [[ "$CONCLUSION" != "success" ]]; then
  echo "Error: Latest CI run on main is not green (status: ${CONCLUSION:-unknown})." >&2
  [[ -n "$RUN_URL" ]] && echo "  $RUN_URL" >&2
  exit 1
fi
echo "CI is green."

# ─── Show open PRs ──────────────────────────────────────────────────────────────

OPEN_PRS=$(gh pr list --base main --json number,title,url)
PR_COUNT=$(echo "$OPEN_PRS" | jq 'length')

if [[ "$PR_COUNT" -gt 0 ]]; then
  echo ""
  echo "There are $PR_COUNT open PR(s) targeting main:"
  echo "$OPEN_PRS" | jq -r '.[] | "  #\(.number) \(.title)\n    \(.url)"'
  echo ""
  read -rp "Continue releasing? [y/N] " CONFIRM
  if [[ ! "$CONFIRM" =~ ^[yY]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

# ─── Bump version ───────────────────────────────────────────────────────────────

CURRENT_VERSION=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case "$BUMP_TYPE" in
  major) NEW_VERSION="$((MAJOR + 1)).0.0" ;;
  minor) NEW_VERSION="${MAJOR}.$((MINOR + 1)).0" ;;
  patch) NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))" ;;
esac

TAG="v${NEW_VERSION}"
BRANCH="release/${TAG}"

echo ""
echo "Bumping version: ${CURRENT_VERSION} -> ${NEW_VERSION}"
npm version "$NEW_VERSION" --no-git-tag-version --quiet

# ─── Create release branch and PR ───────────────────────────────────────────────

git checkout -b "$BRANCH" main
git add package.json package-lock.json
git commit -m "Update version to ${TAG}"
git push -u origin "$BRANCH"

PR_URL=$(gh pr create --title "Release ${TAG}" --body "Bump version to ${TAG}" | tail -1)
PR_NUMBER=$(gh pr view "$PR_URL" --json number -q .number)

echo ""
echo "PR created: $PR_URL"
echo "Waiting for PR #${PR_NUMBER} to be merged..."

# ─── Poll for PR merge ──────────────────────────────────────────────────────────

while true; do
  STATE=$(gh pr view "$PR_NUMBER" --json state -q .state)
  if [[ "$STATE" == "MERGED" ]]; then
    echo ""
    echo "PR #${PR_NUMBER} merged."
    break
  fi
  printf "."
  sleep 10
done

# ─── Tag and push ───────────────────────────────────────────────────────────────

git checkout main
git pull
git tag "$TAG"
git push origin "$TAG"

echo "Tag ${TAG} pushed."
echo "Waiting for release workflow..."

# ─── Poll for release CI ────────────────────────────────────────────────────────

sleep 5 # give GitHub a moment to register the run
while true; do
  RUN=$(gh run list --branch "$TAG" --workflow release.yml --limit 1 --json status,conclusion,url)
  STATUS=$(echo "$RUN" | jq -r '.[0].status // empty')
  RUN_CONCLUSION=$(echo "$RUN" | jq -r '.[0].conclusion // empty')
  RELEASE_RUN_URL=$(echo "$RUN" | jq -r '.[0].url // empty')

  if [[ "$STATUS" == "completed" ]]; then
    echo ""
    if [[ "$RUN_CONCLUSION" == "success" ]]; then
      echo "Release workflow completed successfully."
    else
      echo "Release workflow finished with status: ${RUN_CONCLUSION}" >&2
    fi
    [[ -n "$RELEASE_RUN_URL" ]] && echo "  $RELEASE_RUN_URL"
    break
  fi
  printf "."
  sleep 10
done

# ─── Summary ────────────────────────────────────────────────────────────────────

echo ""
echo "Release ${TAG} complete!"
echo "  GitHub: https://github.com/${REPO}/releases/tag/${TAG}"
echo "  npm:    https://www.npmjs.com/package/chartmogul-node/v/${NEW_VERSION}"
