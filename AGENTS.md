# Agent Rules

## Resume Positioning

- For resume tailoring, cover letters, recruiter replies, application prompts,
  LinkedIn copy, and elevator pitches, consult `CAREER_POSITIONING_NOTES.md`
  before drafting.
- For any tailored resume or CV, consult `MASTER_RESUME_BANK.md` before
  cutting content. Treat the bank as the source of truth for full experience,
  project, skill, credit, award, and length-policy inventory; the final resume is
  an edited output, not the master record.
- For visual resume production, portfolio one-pagers, PDF layouts, and any
  designed career artifact, consult `DESIGN.md` before drafting or generating.
- Preserve Tawfeeq's entertainment-specific credits when relevant; frame them
  as production-ready invention, market-facing proof, customer signal, and
  creative/business opportunity rather than treating them as decorative credits.
- Use 3 pages when the role strongly benefits from deeper seniority, credits,
  and project proof. Do not force 2 pages if it removes highly relevant
  evidence; instead provide a stronger 3-page version plus an ATS/text
  companion when useful.
- Character references/testimonials are protected source material. For each
  tailored resume, decide explicitly whether to include them in the body, on a
  third page, or in a separate references addendum. Do not silently strip them.
- Keep The Mill-era projects under The Mill or in a separate selected-projects
  section, not under ILM: Cashmere Cat, REEPS ONE, Louis Vuitton, and The Game
  Awards/Apex Legends are The Mill-era innovation proof.
- Keep the voice warm, specific, quietly confident, and human. Avoid flattening
  the story into generic corporate language unless a small amount of ATS wording
  is needed for the target role.

## Deploying

- In this repo, "push" means push to GitHub and deploy Cloudflare Pages.
- After committing and pushing `main`, run `./deploy.sh main`.
- Do not report the site as pushed/deployed until `deploy-info.json` on
  `https://tawfeeqmartin.com` matches the current commit.
- If Cloudflare auth fails, say explicitly that GitHub was pushed but
  production is still stale. Do not imply Cloudflare updated.
- For reliable non-interactive deploys, use untracked `.env.cloudflare` with
  `CLOUDFLARE_API_TOKEN` and, if needed, `CLOUDFLARE_ACCOUNT_ID`.
- Keep `.env.cloudflare` out of git.

## GPT Image 2.0 API Generation

- For this repo's final website/background image work, use only
  `scripts/gpt-image-2-api`. It is a repo-local OpenAI Images API client, always
  uses `--model gpt-image-2`, and rejects any other model.
- Use `.env.openai` for `OPENAI_API_KEY`; keep `.env.openai` out of git. The
  script reads it automatically when present.
- For final background plates, prefer `--size 3840x2160 --quality high
  --output-format png`, inspect the PNG, then convert the selected result to the
  project asset path such as `media/bedroom-bg-01.jpg`.
- Use `output/gpt-image-2/` and `tmp/gpt-image-2/` for new GPT Image 2.0 API
  outputs, prompts, and reference files.
- Do not use any generic image-generation helper for this bedroom-background
  workflow unless the user explicitly asks for the OAuth/no-API-key path. The
  required path is the direct GPT Image 2.0 API script above.
- A direct public API test with the ChatGPT OAuth token from `~/.codex/auth.json`
  failed with a missing `api.model.read` scope. For explicit GPT Image 2.0 work,
  use `scripts/gpt-image-2-api` with `.env.openai`.
- GPT Image 2.0 API outputs include embedded provenance strings containing
  `gpt-image`, `version 2.0`, and `OpenAI Media Service API`; use artifact
  dimensions/provenance to confirm final outputs.
- For the CRT bedroom background, the 3D Macintosh and a low-draw-call 3D
  warm-white matte tabletop are composited by the page. Fresh GPT Image 2.0
  background prompts should generate the room/environment only: no foreground
  desk, no foreground table, and no tabletop. The lower frame should stay clean
  enough for the 3D tabletop/Mac/keyboard/mouse overlay to sit in front.
