#!/usr/bin/env bash
# Deploy the resume site to Cloudflare Pages (project: resume).
# All large media is served from R2 via media.tawfeeqmartin.com, so the
# whole media/ tree is excluded from the Pages upload.

set -euo pipefail

cd "$(dirname "$0")"

PROJECT_NAME="resume"
BRANCH="${1:-main}"
STAGE_DIR="$(mktemp -d -t cf-pages-XXXXXX)"
trap 'rm -rf "$STAGE_DIR"' EXIT

echo "→ staging deploy tree in $STAGE_DIR"
rsync -a \
  --exclude '.git' \
  --exclude '.wrangler' \
  --exclude 'node_modules' \
  --exclude 'deploy.sh' \
  --exclude 'tweaks-panel.jsx' \
  --exclude 'cloudflare' \
  --exclude 'review' \
  --exclude 'archive' \
  --exclude 'models' \
  --exclude 'fonts' \
  --exclude 'nvidia-job-links.txt' \
  --exclude '*.md' \
  --exclude 'media' \
  --exclude '.DS_Store' \
  ./ "$STAGE_DIR/"

echo "→ adding whitelisted runtime media"
mkdir -p \
  "$STAGE_DIR/media/3d" \
  "$STAGE_DIR/media/demo" \
  "$STAGE_DIR/media/imessage/generated"
cp media/3d/apple_macintosh.glb "$STAGE_DIR/media/3d/"
cp media/demo/mac4.jpg "$STAGE_DIR/media/demo/"
cp media/imessage/generated/*-avatar-v4.png "$STAGE_DIR/media/imessage/generated/"

# Serve the portfolio directly at the domain root. Cloudflare Pages already
# canonicalizes /Resume.html to /Resume, but the root should not depend on the
# tiny redirect shell in source.
cp "$STAGE_DIR/Resume.html" "$STAGE_DIR/index.html"

COMMIT_HASH="$(git rev-parse HEAD)"
COMMIT_SHORT="$(git rev-parse --short HEAD)"
MSG="$(git log -1 --pretty=%s)"

echo "→ deploying $COMMIT_SHORT ($MSG) to Cloudflare Pages project '$PROJECT_NAME' (branch: $BRANCH)"
echo "  staged file count: $(find "$STAGE_DIR" -type f | wc -l | tr -d ' ')"

npx --yes wrangler@latest pages deploy "$STAGE_DIR" \
  --project-name "$PROJECT_NAME" \
  --branch "$BRANCH" \
  --commit-hash "$COMMIT_HASH" \
  --commit-message "$MSG"
