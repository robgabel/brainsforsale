#!/usr/bin/env bash
#
# deploy.sh — commit pack + website changes and push to trigger Vercel deploy
#
# Usage:
#   ./scripts/deploy.sh                           # commit staged changes with default msg
#   ./scripts/deploy.sh "fix: mobile sidebar"     # commit with custom message
#   ./scripts/deploy.sh --dry-run                 # show what would be committed, don't push
#
# What it does:
#   1. Moves to the brainsfor repo root
#   2. Stages pack/, website/public/brains/, and scripts/export-brain.py
#   3. Shows what's about to be committed
#   4. Commits with a message
#   5. Pushes to origin (Vercel auto-deploys on push)
#
# Note: Vercel's prebuild hook (website/scripts/sync-brain-assets.mjs) will
# re-mirror pack/ into website/public/brains/ at build time, so technically
# the website/public/brains/ files don't need to be committed. They are
# committed anyway so local previews match production without running
# `npm run prebuild` first.

set -euo pipefail

cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

DRY_RUN=0
COMMIT_MSG=""

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) COMMIT_MSG="$arg" ;;
  esac
done

if [[ -z "$COMMIT_MSG" ]]; then
  COMMIT_MSG="chore: sync brain packs + website public assets"
fi

echo "▸ repo: $REPO_ROOT"
echo "▸ staging pack/, website/public/brains/, and export pipeline changes..."

git add \
  brains/*/pack \
  brains/index.json \
  website/public/brains \
  scripts/export-brain.py \
  scripts/deploy.sh

echo
echo "▸ staged changes:"
git diff --cached --stat

if ! git diff --cached --quiet; then
  :
else
  echo "▸ nothing to commit — working tree clean"
  exit 0
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo
  echo "▸ --dry-run set: not committing or pushing"
  echo "  run without --dry-run to ship it"
  exit 0
fi

echo
echo "▸ committing..."
git commit -m "$COMMIT_MSG"

echo
echo "▸ pushing to origin..."
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git push origin "$CURRENT_BRANCH"

echo
echo "✓ deployed — Vercel will rebuild brainsforsale.com from commit $(git rev-parse --short HEAD)"
echo "  watch: https://vercel.com/dashboard"
