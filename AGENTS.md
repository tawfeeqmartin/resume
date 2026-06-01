# Agent Rules

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
