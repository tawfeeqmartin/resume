# Go-Live Notes

Status: keep working offline until the resume page is ready to publish.

## Target Hosting

- Use Cloudflare Pages for the static site: `Resume.html`, JS, CSS, and small assets.
- Use Cloudflare R2 for large media files, preferably on a custom media subdomain such as `media.tawfeeqmartin.com`.
- Aim to stay inside Cloudflare's free tiers where possible.

## Why Not Pages-Only

Cloudflare Pages has a per-file static asset limit that is too small for the current videos. The large media files should not be deployed as Pages assets.

Current large assets include:

- `media/help_full.webm` - full HELP MESH video, very large.
- `media/bg.mov` - header background source file, too large for GitHub and Pages.
- `media/blackbird.mp4`
- `media/blackbird-original-16x9.mp4`
- `media/blackbird-innovation.mp4`
- `media/blackbird-innovation-original-16x9.mp4`

## Media Strategy

- Store large media in R2 Standard storage.
- Configure public access through a custom domain, not the `r2.dev` development URL for production.
- Add cache rules for media paths with long edge/browser TTLs.
- Confirm R2 responses include `Content-Length` so browsers and Cloudflare can handle range requests efficiently.
- Keep media URLs configurable so local development can use `media/...` and production can use `https://media.../...`.
- Keep `media/bg.mov` and `media/help_full.webm` out of normal Git history unless Git LFS is added. They exceed GitHub's normal file limits.

## HELP MESH Player Caveat

The current HELP player loads the video via `fetch()` and creates a Blob URL. That means the full `help_full.webm` can be pulled into memory before playback.

Before publishing, update the HELP loader so it:

- Reads only the header/metadata needed to extract the MESH projection.
- Sets the video element `src` directly to the remote media URL.
- Lets the browser stream/range-load the actual video data.
- Preserves the custom MESH metadata path from the source WebM.

This is the main optimization needed before going live.

## Cost Expectation

Expected cost should be free or very low for normal portfolio traffic if:

- Pages hosts only the static site.
- R2 hosts the large assets.
- Media is cacheable.
- The HELP loader is fixed to avoid full-file eager downloads.

Cloudflare Stream can be considered later for normal flat videos, but it should not be used for the HELP MESH video unless verified to preserve the custom projection metadata.
