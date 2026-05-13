# Tawfeeq Martin Resume / Folio

Static portfolio site for Tawfeeq Martin, focused on creative technology, virtual production, immersive media, and technical product management.

## Local Preview

```sh
python3 -m http.server 8021
```

Open:

```text
http://127.0.0.1:8021/Resume.html
```

## Media Notes

The full-quality local source files below are intentionally ignored because they exceed normal GitHub file limits:

- `media/bg.mov`
- `media/help_full.webm`

The checked-in site uses web-ready media for local preview. For production, move the large assets to Cloudflare R2, Git LFS, or a dedicated streaming host and update the media URLs.

## Audio / Interaction Notes

The header audio and interaction design uses vendored Strudel plus a normalized MIDI-like lane event bus. Current implementation details, channel mapping, proof stamp behavior, and the future scroll-composition idea are documented in `BLACKOUT_RESEARCH_NOTES.md`.

## Build Blueprint

The reusable site build system is documented in `SITE_BUILD_BLUEPRINT.md`. That document covers the interactive header, video players, HELP MESH playback, Strudel/MIDI audio integration, scroll-composition direction, mobile rules, hosting/media strategy, and verification checklist.
