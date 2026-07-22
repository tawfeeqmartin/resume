#!/usr/bin/env bash
# Deploy the resume site to Cloudflare Pages (project: resume).
# All large media is served from R2 via media.tawfeeqmartin.com, so the
# whole media/ tree is excluded from the Pages upload.

set -euo pipefail

cd "$(dirname "$0")"

PROJECT_NAME="resume"
BRANCH="${1:-main}"
PRODUCTION_ORIGIN="${PRODUCTION_ORIGIN:-https://tawfeeqmartin.com}"
WRANGLER_VERSION="${WRANGLER_VERSION:-4.96.0}"
CLOUDFLARE_ENV_FILE="${CLOUDFLARE_ENV_FILE:-.env.cloudflare}"
DEFAULT_CLOUDFLARE_ACCOUNT_ID="0dc8091911bb938dc2f50bbb8defa12b"
STAGE_DIR="$(mktemp -d -t cf-pages-XXXXXX)"
DEPLOY_LOG="$(mktemp -t cf-pages-deploy-log-XXXXXX)"
trap 'rm -f "$DEPLOY_LOG"; rm -rf "$STAGE_DIR"' EXIT

if [[ -f "$CLOUDFLARE_ENV_FILE" ]]; then
  echo "→ loading Cloudflare deploy env from $CLOUDFLARE_ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$CLOUDFLARE_ENV_FILE"
  set +a
fi

read_cached_account_id() {
  node -e '
    const fs = require("node:fs");
    for (const file of [".wrangler/cache/pages.json", ".wrangler/cache/wrangler-account.json"]) {
      try {
        const data = JSON.parse(fs.readFileSync(file, "utf8"));
        const id = data.account_id || data.account?.id || "";
        if (id) {
          console.log(id);
          process.exit(0);
        }
      } catch {}
    }
  ' 2>/dev/null || true
}

if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  CLOUDFLARE_ACCOUNT_ID="$(read_cached_account_id)"
fi

if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  CLOUDFLARE_ACCOUNT_ID="$DEFAULT_CLOUDFLARE_ACCOUNT_ID"
fi
export CLOUDFLARE_ACCOUNT_ID

wrangler() {
  npx --yes "wrangler@${WRANGLER_VERSION}" "$@"
}

cloudflare_auth_hint() {
  cat >&2 <<EOF
Cloudflare auth failed before deployment.

Fix:
  npx --yes wrangler@${WRANGLER_VERSION} login

Then rerun:
  ./deploy.sh ${BRANCH}

For token-based deploys, export CLOUDFLARE_API_TOKEN with Cloudflare Pages edit access
and account read access, or put it in untracked ${CLOUDFLARE_ENV_FILE}.
Account id in use: ${CLOUDFLARE_ACCOUNT_ID}
EOF
}

echo "→ checking Cloudflare auth (account: $CLOUDFLARE_ACCOUNT_ID, wrangler: $WRANGLER_VERSION)"
if ! wrangler pages project list --json >/dev/null; then
  cloudflare_auth_hint
  exit 1
fi

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
if [[ "${ALLOW_DIRTY:-0}" == "1" ]]; then
  # Preview deployments may intentionally contain uncommitted work. Reusing
  # the commit-only immutable key in that case lets browsers keep an older
  # bundle even after a successful upload, making the branch alias appear
  # unchanged. Production still requires a clean tree and retains git-* keys.
  ASSET_VERSION="preview-${COMMIT_SHORT}-$(date -u +%Y%m%d%H%M%S)"
fi
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
  --exclude '.env*' \
  --exclude '.claude' \
  --exclude '.job-agent' \
  --exclude 'tmp' \
  --exclude 'data-*.js' \
  --exclude 'resume-*.html' \
  --exclude '*.pdf' \
  --exclude 'job-agent*' \
  --exclude 'landing-v1.html' \
  --exclude 'lib' \
  --exclude 'data' \
  --exclude 'output' \
  --exclude 'blender' \
  --exclude 'gpt-image-2-api' \
  ./ "$STAGE_DIR/"

echo "→ adding whitelisted runtime media"
mkdir -p \
  "$STAGE_DIR/media/3d" \
  "$STAGE_DIR/media/audio/glitches/dry" \
  "$STAGE_DIR/media/demo" \
  "$STAGE_DIR/media/imessage/generated" \
  "$STAGE_DIR/media/interactive" \
  "$STAGE_DIR/media/resume"
# Resume variants are excluded from the broad deploy copy above. The public
# landing page links to this authored HTML resume, so whitelist it explicitly.
cp resume-readonly.html "$STAGE_DIR/"
cp \
  media/believe-blackbird-selected.jpg \
  media/bg.poster.jpg \
  media/louis-vuitton-ss20-poster.jpg \
  media/stagecraft-hero.png \
  media/believe-help-source.jpg \
  media/human-race-poster.jpg \
  "$STAGE_DIR/media/"
cp \
  media/demo/help-bts.webp \
  media/demo/help-bts-2.webp \
  "$STAGE_DIR/media/demo/"
cp media/resume/*.jpg "$STAGE_DIR/media/resume/"
cp media/3d/apple_macintosh.glb "$STAGE_DIR/media/3d/"
cp \
  media/interactive/hand-of-god.html \
  media/interactive/hand-of-god-source.html \
  "$STAGE_DIR/media/interactive/"
# The short dry glitch pool is deliberately same-origin: these files are used
# by both HTMLAudioElement and Web Audio fallback paths during the first user
# gesture. Keep them in Pages while large/long-form media remains on R2.
cp media/audio/glitches/dry/*.wav "$STAGE_DIR/media/audio/glitches/dry/"
# These two small authored DESIGN animations are part of the intro's semantic
# frame order. Shipping them with Pages prevents a missing video from being
# replaced by the first (photoreal) still plate on staging.
cp \
  media/taurus-animalpose-walkcycle-48f.mp4 \
  media/taurus-animalpose-colored-skeleton-48f.mp4 \
  "$STAGE_DIR/media/"
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

wrangler pages deploy "$STAGE_DIR" \
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
