#!/usr/bin/env bash
# Deploy the resume site to Cloudflare Pages (project: resume).
# All large media is served from R2 via media.tawfeeqmartin.com, so the
# whole media/ tree is excluded from the Pages upload.

set -euo pipefail

cd "$(dirname "$0")"

PROJECT_NAME="resume"
BRANCH="${1:-main}"
PRODUCTION_ORIGIN="${PRODUCTION_ORIGIN:-https://tawfeeqmartin.com}"
STAGE_DIR="$(mktemp -d -t cf-pages-XXXXXX)"
DEPLOY_LOG="$(mktemp -t cf-pages-deploy-log-XXXXXX)"
trap 'rm -f "$DEPLOY_LOG"; rm -rf "$STAGE_DIR"' EXIT

echo "→ running preflight checks"
npm run build
node --check scripts/serve-local.mjs
node --check spotlight-bundle.js
npm run check:tv-clips

if [[ "${ALLOW_DIRTY:-0}" != "1" ]] && [[ -n "$(git status --porcelain)" ]]; then
  echo "Deploy aborted: working tree is not clean after build." >&2
  echo "Commit the build output first, or rerun with ALLOW_DIRTY=1 for an intentional preview-only deploy." >&2
  git status --short >&2
  exit 1
fi

COMMIT_HASH="$(git rev-parse HEAD)"
COMMIT_SHORT="$(git rev-parse --short HEAD)"
ASSET_VERSION="git-${COMMIT_SHORT}"
MSG="$(git log -1 --pretty=%s)"

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

node scripts/prepare-pages-deploy.mjs "$STAGE_DIR" "$ASSET_VERSION" "$COMMIT_HASH" "$COMMIT_SHORT" "$BRANCH"

echo "→ deploying $COMMIT_SHORT ($MSG) to Cloudflare Pages project '$PROJECT_NAME' (branch: $BRANCH)"
echo "  staged file count: $(find "$STAGE_DIR" -type f | wc -l | tr -d ' ')"
echo "  asset version: $ASSET_VERSION"

npx --yes wrangler@latest pages deploy "$STAGE_DIR" \
  --project-name "$PROJECT_NAME" \
  --branch "$BRANCH" \
  --commit-hash "$COMMIT_HASH" \
  --commit-message "$MSG" | tee "$DEPLOY_LOG"

PREVIEW_URL="$(grep -Eo 'https://[a-z0-9]+\.resume-bmd\.pages\.dev' "$DEPLOY_LOG" | tail -1 || true)"
if [[ -n "$PREVIEW_URL" ]]; then
  echo "→ verifying preview $PREVIEW_URL"
  node scripts/verify-pages-deploy.mjs "$PREVIEW_URL" "$ASSET_VERSION" "$COMMIT_HASH" --timeout-ms=45000
else
  echo "Warning: could not find Cloudflare preview URL in deploy output." >&2
fi

if [[ "$BRANCH" == "main" ]]; then
  echo "→ verifying production $PRODUCTION_ORIGIN"
  node scripts/verify-pages-deploy.mjs "$PRODUCTION_ORIGIN" "$ASSET_VERSION" "$COMMIT_HASH" --timeout-ms=120000
fi
