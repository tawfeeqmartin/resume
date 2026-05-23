# Open Source Reference Cache

This project uses `opensrc` as a local source-code cache for third-party
libraries that agents need to inspect. The cache lives outside the repo so
third-party source is not accidentally committed or deployed.

## Local Setup

Installed CLI:

```sh
npm install -g opensrc
```

Shared cache root:

```sh
export OPENSRC_HOME="$HOME/Dev/.opensrc"
```

Current cached references:

```sh
OPENSRC_HOME="$HOME/Dev/.opensrc" opensrc list
```

Expected Strudel entries:

```text
@strudel/web@1.3.0
  /Users/tm/Dev/.opensrc/repos/codeberg.org/uzu/strudel/1.3.0
```

## Strudel Example

The canonical Strudel source is Codeberg:

```text
https://codeberg.org/uzu/strudel
```

In the current `opensrc` CLI, raw Codeberg URLs such as
`https://codeberg.org/uzu/strudel` and `codeberg.org/uzu/strudel` are treated
as package names and fail. Resolve Strudel through the package spec instead:

```sh
export OPENSRC_HOME="$HOME/Dev/.opensrc"

STR_REPO="$(opensrc path '@strudel/web' --cwd "$PWD")"
# or, from this repo:
STR_REPO="$(./scripts/opensrc-strudel.sh "$PWD")"

rg -n "initStrudel|evaluate|samples\\(|onTrigger|draw\\(" "$STR_REPO" \
  --glob '!**/node_modules/**' \
  --glob '!**/.git/**'

sed -n '860,910p' "$STR_REPO/packages/core/pattern.mjs"
sed -n '1,90p' "$STR_REPO/packages/web/web.mjs"
```

Useful Strudel files already found:

- `packages/web/web.mjs`: `initStrudel`, `evaluate`, browser entry point.
- `packages/core/pattern.mjs`: `Pattern.prototype.onTrigger`, `samples` docs.
- `packages/superdough/sampler.mjs`: sample registration and playback.
- `website/src/pages/learn/samples.mdx`: Strudel sample-loading examples.
- `website/src/pages/technical-manual/repl.mdx`: REPL scheduling and trigger model.

## Agent Instruction Snippet

When asking an agent to inspect Strudel or another open-source dependency,
paste this:

```text
Use the local opensrc cache before browsing. Set
OPENSRC_HOME=/Users/tm/Dev/.opensrc, then inspect Strudel with:

  opensrc path '@strudel/web' --cwd /Users/tm/Dev/resume

That resolves to the canonical Codeberg source:
https://codeberg.org/uzu/strudel

From this repo you can also run:

  ./scripts/opensrc-strudel.sh /Users/tm/Dev/resume

Use rg/sed against the returned path. Treat the cached source as the primary
reference for implementation details. Do not copy third-party source into this
repo unless I explicitly ask to vendor or patch it.
```

For another library, replace the package/repo names:

```sh
OPENSRC_HOME="$HOME/Dev/.opensrc" opensrc path three --cwd "$PWD"
OPENSRC_HOME="$HOME/Dev/.opensrc" opensrc path owner/repo
```

## Rules

- Keep `OPENSRC_HOME` outside this repo.
- Do not commit `.opensrc` or cached third-party source.
- Prefer `rg` and targeted `sed` reads against the cache.
- If a source package is version-sensitive, include `--cwd "$PWD"` so
  `opensrc` can resolve versions from the project lockfile.
- Browse only when the user asks for current docs, external citations, or
  the local cache does not contain the needed source.
