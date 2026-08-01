#!/usr/bin/env bash
# Transcode TouchDesigner sketch source clips on Hermes/WSL only.
#
# Source files must already exist on the workstation at:
#   /mnt/e/CC_Projects/resume-touchdesigner/source/
#
# Outputs are written to:
#   /mnt/e/CC_Projects/resume-touchdesigner/web/
#
# Do not run this script on the Mac. It is meant to be invoked over the
# Hermes WSL SSH tunnel, e.g.:
#   ssh -p 22220 tawfeeq@127.0.0.1 'bash /mnt/e/CC_Projects/resume-touchdesigner/hermes-transcode-touchdesigner.sh'

set -euo pipefail

SOURCE_DIR="${SOURCE_DIR:-/mnt/e/CC_Projects/resume-touchdesigner/source}"
OUTPUT_DIR="${OUTPUT_DIR:-/mnt/e/CC_Projects/resume-touchdesigner/web}"
MAX_WIDTH="${MAX_WIDTH:-960}"
FPS="${FPS:-24}"
CRF="${CRF:-28}"
PRESET="${PRESET:-slow}"

mkdir -p "$OUTPUT_DIR"

require_file() {
  local file="$1"
  if [[ ! -f "$SOURCE_DIR/$file" ]]; then
    echo "Missing source: $SOURCE_DIR/$file" >&2
    exit 1
  fi
}

transcode_tile() {
  local input="$1"
  local output="$2"
  require_file "$input"
  echo "→ $input -> $output"
  ffmpeg -hide_banner -y \
    -i "$SOURCE_DIR/$input" \
    -map 0:v:0 \
    -map 0:a:0? \
    -vf "fps=${FPS},scale='min(${MAX_WIDTH},iw)':-2:flags=lanczos" \
    -c:v libx264 \
    -preset "$PRESET" \
    -crf "$CRF" \
    -pix_fmt yuv420p \
    -c:a aac \
    -b:a 160k \
    -movflags +faststart \
    "$OUTPUT_DIR/$output"
}

command -v ffmpeg >/dev/null || {
  echo "ffmpeg is required on Hermes/WSL." >&2
  exit 1
}

transcode_tile "trim_3002B1E1-6782-4CE0-AE6A-9C9DC538BC74 2.MP4" "touchdesigner-sketch-01-glitch-ui-960.mp4"
transcode_tile "pearlascii.67.MOV" "touchdesigner-sketch-02-pearl-ascii-960.mp4"
transcode_tile "IMG_7934.mov" "touchdesigner-sketch-03-realtime-signal-960.mp4"
transcode_tile "IMG_7953.MOV" "touchdesigner-sketch-04-procedural-system-960.mp4"
transcode_tile "ascii.10.MOV" "touchdesigner-sketch-05-ascii-study-960.mp4"
transcode_tile "scope.5.MOV" "touchdesigner-sketch-06-scope-study-960.mp4"
transcode_tile "pearlascii.4.MOV" "touchdesigner-sketch-07-pearl-ascii-study-960.mp4"

du -h "$OUTPUT_DIR"/*.mp4
