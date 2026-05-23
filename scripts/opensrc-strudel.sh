#!/usr/bin/env bash
set -euo pipefail

# opensrc does not accept a raw Codeberg URL as a path spec in the current CLI.
# Resolve through @strudel/web, whose package metadata points at
# https://codeberg.org/uzu/strudel.
export OPENSRC_HOME="${OPENSRC_HOME:-$HOME/Dev/.opensrc}"
opensrc path '@strudel/web' --cwd "${1:-$(pwd)}"
