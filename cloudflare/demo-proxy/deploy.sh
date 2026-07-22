#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

if [[ -f .env.cloudflare ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.cloudflare
  set +a
fi

npx --yes wrangler@4.96.0 deploy --config cloudflare/demo-proxy/wrangler.toml
