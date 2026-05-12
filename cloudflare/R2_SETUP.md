# Cloudflare R2 Setup

Target bucket: `tawfeeqmartin-resume-media`

Target public media host: `https://media.tawfeeqmartin.com`

## Current State

- Bucket created: `tawfeeqmartin-resume-media`
- Storage class: Standard
- CORS applied from [r2-cors.json](r2-cors.json)
- Custom domain connected: `media.tawfeeqmartin.com`
- Custom domain status: active
- Custom domain SSL status: active
- Verified remote object download works for `blackbird.mp4`
- Uploaded to remote R2:
  - `blackbird.mp4`
  - `blackbird-innovation.mp4`
  - `help-720-mesh.webm`
  - `bg.web.mp4`
  - `bg.poster.jpg`
- Still needs multipart upload:
  - `help_full.webm`
- Cloudflare nameservers active for `tawfeeqmartin.com`:
  - `harlee.ns.cloudflare.com`
  - `rodrigo.ns.cloudflare.com`

## Bucket

Create an R2 bucket using Standard storage. Do not use Infrequent Access for the portfolio media because the free tier applies to Standard storage only.

Before uploading production media, enable the guardrails below:

- Budget alerts at `$1`, `$5`, and `$10`.
- Custom domain only; keep the public `r2.dev` URL disabled for production.
- Cache rule on `media.tawfeeqmartin.com`.
- WAF rate limiting on `media.tawfeeqmartin.com`.
- Long-lived cache filenames or query-string versions so cached media is reused.

Upload these production objects at the bucket root:

- `help_full.webm`
- `blackbird.mp4`
- `blackbird-innovation.mp4`
- `blackbird-original-16x9.mp4`
- `blackbird-innovation-original-16x9.mp4`
- `bg.web.mp4`
- `bg.poster.jpg`

## CORS

Apply [r2-cors.json](r2-cors.json) to the bucket. The HELP player uses the video as a WebGL texture, so the remote video response must allow cross-origin reads from the live site.

## Public Domain

Connect the bucket to a custom domain:

```text
media.tawfeeqmartin.com
```

Use the custom domain for production. The public `r2.dev` endpoint is useful for testing but Cloudflare rate-limits and throttles it.

Production rule: do not switch `Resume.html` to a public `r2.dev` URL.

The Wrangler command needs the Cloudflare zone ID for `tawfeeqmartin.com`:

```sh
npx wrangler r2 bucket domain add tawfeeqmartin-resume-media \
  --domain media.tawfeeqmartin.com \
  --zone-id CLOUDFLARE_ZONE_ID \
  --min-tls 1.2
```

If `tawfeeqmartin.com` is still only hosted in Squarespace and has not been added to Cloudflare DNS, add the domain to Cloudflare first and follow Cloudflare's nameserver instructions at the domain registrar/Squarespace domain settings.

## Full HELP Upload

Wrangler cannot upload `help_full.webm` because it is larger than Wrangler's 300 MiB upload limit. Use one of these paths:

- Create an R2 API token/access key in Cloudflare and upload with S3-compatible multipart tooling.
- Upload `help_full.webm` through the Cloudflare dashboard if the dashboard accepts the file.

Preferred multipart path:

```text
Cloudflare Dashboard > R2 > Manage R2 API Tokens > Create API token
```

Scope it to:

```text
Object Read & Write
Bucket: tawfeeqmartin-resume-media
```

Then use AWS CLI or rclone with the R2 S3 endpoint:

```text
https://0dc8091911bb938dc2f50bbb8defa12b.r2.cloudflarestorage.com
```

## Cache Rule

Create a Cloudflare Cache Rule for:

```text
Hostname equals media.tawfeeqmartin.com
```

Recommended settings:

- Eligible for cache: yes
- Edge TTL: 1 month
- Browser TTL: 1 day
- Respect range requests

For versioned media replacements, upload with a new filename or add a query-string version in the site code.

This is the most important read-operation guardrail. The goal is for repeat views to hit Cloudflare cache instead of repeatedly hitting R2.

## Rate Limit

Create one WAF rate limiting rule for the media host. A conservative starting point:

```text
Hostname equals media.tawfeeqmartin.com
```

Action:

```text
Managed Challenge or Block
```

Threshold:

```text
100 requests per 10 seconds per IP
```

That is not a billing kill-switch, but it prevents obvious runaway refreshes or scripted abuse.

If traffic is normal, loosen later. Start conservative while testing.

## Budget Alerts

In Cloudflare dashboard:

```text
Manage Account > Billing > Billable Usage > Create budget alert
```

Create alerts at:

- `$1`
- `$5`
- `$10`

Budget alerts are informational only. They do not pause service.

## Go-Live Checklist

Do not point the live site at R2 until these are true:

- R2 bucket exists in Standard storage.
- `media.tawfeeqmartin.com` is connected to the bucket.
- Public `r2.dev` URL is not used by the site.
- CORS policy from [r2-cors.json](r2-cors.json) is applied.
- Cache rule is active for `media.tawfeeqmartin.com`.
- WAF/rate limit rule is active for `media.tawfeeqmartin.com`.
- Budget alerts are active.
- `curl -I https://media.tawfeeqmartin.com/help_full.webm` returns `200`, `Content-Length`, and cache-friendly headers.
- `curl -I -H "Range: bytes=0-5242879" https://media.tawfeeqmartin.com/help_full.webm` returns `206` or a valid ranged response.
