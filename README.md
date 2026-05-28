# Tawfeeq Martin Resume / Folio

Static portfolio site for Tawfeeq Martin, focused on creative technology, virtual production, immersive media, and technical product management.

## Local Preview

```sh
npm run serve
```

Open:

```text
http://127.0.0.1:8021/Resume.html
```

Use this server instead of `python3 -m http.server` for HELP work. The HELP
player needs HTTP byte-range support so the browser can stream the original
full `media/help_full.webm` while the loader reads only the MESH metadata
header. Python's basic static server can answer range requests with the whole
569 MB file, which makes local HELP loading unreliable.

## Media Notes

The full-quality local source files below are intentionally ignored because they exceed normal GitHub file limits:

- `media/bg.mov`
- `media/help_full.webm`

The checked-in site uses web-ready media for local preview. For production, move the large assets to Cloudflare R2, Git LFS, or a dedicated streaming host and update the media URLs.

HELP is a locked MESH playback path: production should load the original full
`help_full.webm` through same-origin `/media/help_full.webm`. Do not replace it
with 720, MP4, Cloudflare Stream, a transcode, or a different delivery path
without explicit owner approval and fresh Chrome, Safari/WebKit, and Firefox
verification that the original MESH projection still renders correctly.

## Publish

Use the guarded Cloudflare Pages deploy path:

```sh
./deploy.sh main
```

The script rebuilds the app, checks the HELP/media guardrails, stages only the
small runtime assets, writes `deploy-info.json`, rewrites JS asset query strings
to the current git commit in the staged copy, then verifies the preview and
production domains. Do not manually bump `?v=` strings in `Resume.html`; source
uses `v=local-dev`, and deploy generates the production cache-busting token.

## Audio / Interaction Notes

The header audio and interaction design uses vendored Strudel plus a normalized MIDI-like lane event bus. Current implementation details, channel mapping, proof stamp behavior, and the future scroll-composition idea are documented in `BLACKOUT_RESEARCH_NOTES.md`.

## Build Blueprint

The reusable site build system is documented in `SITE_BUILD_BLUEPRINT.md`. That document covers the interactive header, video players, HELP MESH playback, Strudel/MIDI audio integration, scroll-composition direction, mobile rules, hosting/media strategy, and verification checklist.

## Open Source References

Third-party source inspection uses `opensrc` with a shared cache at
`~/Dev/.opensrc`, outside this repo. See `OPEN_SOURCE_REFERENCES.md` for
the exact setup, Strudel source paths, and the prompt snippet to give future
agents before they inspect library internals.
