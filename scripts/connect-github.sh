#!/usr/bin/env bash
# Create (or attach) a private GitHub repo and push this branch.
# Requires: GitHub CLI (`gh`) logged in as the repo owner.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO_NAME="${GITHUB_REPO_NAME:-protokol-mobile}"
VISIBILITY="${GITHUB_REPO_VISIBILITY:-private}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI first: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Run: gh auth login"
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "origin already set to: $(git remote get-url origin)"
else
  echo "Creating GitHub repo ${REPO_NAME} (${VISIBILITY})..."
  gh repo create "$REPO_NAME" "--${VISIBILITY}" --source=. --remote=origin --disable-wiki
fi

BRANCH="$(git branch --show-current)"
git push -u origin "$BRANCH"
echo "Pushed ${BRANCH} to $(git remote get-url origin)"
echo "Create a PR with: gh pr create --fill"
