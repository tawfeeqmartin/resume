# Site Build Blueprint

This document is the build score for the resume/folio site. Treat it as both technical documentation and part of the artwork: a reusable pattern for future interactive editorial websites where writing, video, diagrams, audio, and interface behavior are composed as one system.

## Core Idea

The site is not a static resume with decorative motion. It is a live demonstration of creative technology: technical proof, cinematic systems, and poetic discovery operating inside the page.

The first interactive work, `poetry in proof`, sets the tone. It uses dense technical prose, crisp reference drawings, boxed discovery words, connecting lines, and Strudel-driven audio events to reveal phrases inside credible technical material. The rest of the site should feel like it grows from that same language: exact, cinematic, interactive, and restrained.

## Project Shape

Current build style:

- Static site, no bundler required.
- Entry page: `Resume.html`.
- Main React/Babel app: `components.js`.
- Data/content support: `data.js`.
- Vendored runtime libraries live in `vendor/`.
- Local media lives in `media/`.
- Large production media should live in Cloudflare R2, not in the static site deploy.

Local preview:

```sh
python3 -m http.server 8021
```

Open:

```text
http://127.0.0.1:8021/Resume.html
```

The site currently favors an offline-friendly static workflow so design iteration stays fast and portable. If this becomes a repeatable framework later, the first migration target should be a lightweight build step that preserves the same component boundaries.

## Standing Documentation Rule

Any custom workflow, media pipeline, toolchain install, browser behavior, reusable animation system, MIDI/audio mapping, or one-off conversion that may be useful again must be documented here before the task is considered finished. Include:

- The reason it exists.
- The canonical local paths.
- The exact command or function entry point to reuse.
- Any production upload/cache step required after local generation.
- Any failure mode already encountered and how to avoid repeating it.

Open-source library references are cached with `opensrc` outside the repo at
`~/Dev/.opensrc`. See `OPEN_SOURCE_REFERENCES.md` before browsing or
re-fetching source for Strudel, Three.js, js-dos, or similar dependencies.

## Visual System

Design direction:

- Frontier white is the default theme.
- Backgrounds should read as actual white, not green-tinted gradients.
- Apple/editorial white is the base system; Bauhaus/Oliver Byrne color language is reserved for functional interactions, proof marks, and technical diagrams.
- Use geometric forms as functional marks, not decoration. Avoid repeating the primary shapes as generic bullets, separators, or section confetti.
- Keep linework crisp. Avoid glow, soft marker-like strokes, and thick fuzzy drawing lines.
- Technical drawings must be credible, referenced, labeled cleanly, and never feel hallucinated.
- Labels should be small and standardized; drawing titles should be larger and placed consistently.
- Avoid overlapping labels, cropped marks, and inconsistent drawing placement between page turns.

Functional visual motifs:

- Quiet section rails.
- Filled Bauhaus shape markers only when they control or demonstrate something.
- Byrne-style colored proof fills.
- Dotted connector lines between boxed discovery words.
- Terminal blocks and code blocks that look intentionally formatted, not generic cards.
- Video controls built from the site shape language.

## Header Interactive Work

Name: `poetry in proof`.

Purpose:

- Demonstrate taste and technical fluency before the visitor reads the resume.
- Make the header feel like a working mixed-media instrument.
- Let visitors discover phrases inside real technical material rather than seeing slogans pasted on top.

Content rules:

- Technical prose must be credible and substantial.
- Sentences should use normal capitalization and punctuation.
- Code blocks, terminal snippets, formulas, and references should relate to the page topic.
- Poetic target words must fit naturally into the prose. Prefer replacing a synonym only when the sentence still reads technically.
- Never plant a full phrase in one obvious sentence. Target words should be spread apart enough that the connecting system matters.

Animation rules:

- The heading types out letter by letter with a bold terminal-style cursor.
- Discovery sequence should follow: box, line/dot, next box, line/dot, next box.
- Connector lines must not occlude boxed words.
- Drawing reactions should come from musical lane events, not arbitrary timers.
- Reduced-motion users should still get a readable, stable page.

Drawing rules:

- Each drawing should represent a real concept: Euclid construction, Pythagorean relation, calculus curve, optics/rays, perspective/frustum, Turing machine, Shannon channel, Licklider interaction, rendering equation, distributed ray tracing, light field, neural network/backpropagation, attention, story systems, etc.
- Do not label drawings as "plates" in the UI.
- Use fills only where they clarify the construction.
- Use labels outside shapes whenever possible.
- Keep formulas tied to the actual concept being drawn.
- Current implementation uses authored 1000x420 SVG diagrams with a shared Byrne-inspired title/label system, black construction strokes, rounded joins/caps, and Byrne-reference fills (`#fac22b`, `#0e638e`, `#d42a20`). Mobile uses a fixed-height panel frame so page turns do not shift the resume content below.

Reference details live in `BLACKOUT_RESEARCH_NOTES.md` and `DIAGRAM_RESEARCH_AUDIT.md`.

## Audio Engine

Current engine:

- Vendored Strudel runtime: `vendor/strudel-web.mjs`.
- Bootstrapped in `Resume.html`.
- Wrapped by `getResumeStrudelAudioEngine()` in `components.js`.
- User-armed only. Browsers require a click/tap before audio can start.

Design rule:

Audio should feel composed, not random. The Strudel patterns should be written as explicit musical structures. Avoid hidden mutation systems that make debugging impossible.

Current musical direction:

- Moody melodic mid-tempo/trap/stutterhouse influence.
- One primary song is active for now.
- WASD overrides the chord pad using the same harmonic identities as autoplay.
- When WASD stops, autoplay chord behavior should return on the next measure.
- The site music should duck or stop when a video plays with audio, then fade back after playback stops for a short delay.

## MIDI Lane System

The key architecture is a normalized MIDI-like event bus. Strudel is the transport; visual systems subscribe to lane events.

Event name:

```js
resume-midi-event
```

Event detail contract:

```js
{
  source: "strudel",
  type: "noteon",
  group: "drums" | "bass" | "harmony" | "melody" | "scene",
  lane: "kick",
  channel: 1,
  note: 36,
  noteName: "kick",
  velocity: 1,
  duration: 640,
  id: 123,
  scheduledTime: 0
}
```

Rules:

- Every instrument lane gets its own stable MIDI channel.
- Strudel patterns call named handlers on `window.__resumeLaneTriggers`.
- The handlers close over lane identity and emit normalized events.
- Visual systems should filter by `group`, `lane`, `channel`, or `note`.
- Do not add animation hacks that fake musical timing.
- MIDI output and future MIDI input should use this same channel map.

Current channel map:

```text
1  kick      note 36  drums
2  snare     note 38  drums
3  hat       note 42  drums
4  perc      note 39  drums
5  bass      note 36  bass
6  chord     note 48  harmony
7  wasdChord note 52  harmony
8  chop      note 72  melody
9  lead      note 76  melody
10 lift      note 79  melody
11 angel     note 84  melody
12 build     note 67  melody
13 switch    note 71  melody
14 ghost     note 74  melody
15 dust      note 96  melody
16 vocal     note 60  vocal
```

## Music-Reactive Visuals

Current subscribers:

- Header drawings react to melody, harmony, and drum lanes.
- Discovery word/line timing is tied to music timing.
- Award proof stamps listen to normalized MIDI lane events.

Award stamp behavior:

- HELP and Blackbird award stamps use small Elements-of-Euclid-inspired diagrams.
- The line art is always visible.
- Interior fills are transparent at rest.
- On the mapped lane hit, the fill snaps to yellow/blue/red.
- Keep stamp mappings aligned to the current default song. Current mappings:
  HELP = `chord`, `lead`, `bass`, `snare`; Blackbird = `kick`, `bass`, `lead`.
- Use direct SVG `fill` switching for stamp fills. Do not rely on `opacity` or `fill-opacity`; Chrome did not apply those reliably on these SVG paths during testing.

Manual test hook:

```js
window.__resumeProofStampPulse("kick")
window.__resumeProofStampPulse("lead")
```

## Scroll Composition

Future direction:

The page scroll should become a mixer.

Behavior target:

- At the top interactive demo, the full composition plays once sound is armed.
- As the visitor scrolls down, the mix narrows or layers according to site sections.
- Yellow section introduces or emphasizes the yellow musical element.
- Blue section layers in the blue musical element.
- Red section layers in the red musical element.
- At the bottom of the page, the full composition is present.
- Scrolling back up reverses the layering.
- Returning to the top restores the full composition.

Implementation rule:

Build this as section-level mix state on top of the existing Strudel/MIDI lane system. Do not create a second audio engine.

Likely route:

- Add a scroll observer that computes section weights.
- Map section weights to Strudel stem gains or lane mutes.
- Keep the `resume-midi-event` bus active regardless of mix state so visuals can remain in time.
- Preserve user intent: if sound is off, scrolling must not start audio.

## Video Players

There are two player families.

### Flat Video Slots

Used for Blackbird videos and similar project media.

Expected behavior:

- Hover may preview silently.
- Play starts from the beginning with audio.
- Restart uses the blue circle behavior.
- Pause uses red pause bars.
- Fullscreen uses the small white corner arrow.
- Controls auto-hide off hover and reappear on hover/focus.
- Only the user-held video should continue playing with audio.
- Other videos should pause when out of view, when another video is user-started, or when the page is backgrounded.
- Portrait fullscreen should letterbox rather than crop.
- Landscape fullscreen should occupy the screen properly.

### HELP MESH Player

Used for `HELP`, which is not normal equirectangular 360 video.

Purpose:

- Decode/play the original Google Spotlight Stories MESH projection.
- Render it interactively in-browser through the mesh player code brought from the sibling Spotlight project.

Expected behavior:

- Desktop: drag to look, WASD control, spacebar play/pause, fullscreen.
- Mobile: touch gesture interaction; do not show desktop WASD OSD.
- Gyro support can be explored, but must be tested on real phone hardware.
- Mobile should use a compatible MP4 fallback if WebM/MESH playback is not viable on the target browser.
- If full MESH interactivity cannot be preserved on mobile, document that clearly and choose the best playback fallback.

Performance rule:

The HELP player should stream media. It should not fetch the entire full-quality file into memory just to start playback.

### CRT TV Clip Sampler

Used for the sticky Sony Trinitron hero.

Detailed edit rules live in `EDIT_GRAMMAR.md`. That document is the source of
truth for music-lane behavior, clip tags, and what must be pre-baked rather
than computed live.

Purpose:

- Treat the TV as a music-synced montage surface.
- Cut or channel-flip clips on normalized Strudel/MIDI lane events.
- Keep trailer/work-footage sourcing manifest-driven so cleared files can be swapped without rewriting the component.

Current behavior:

- `TvHero` accepts `sources` with `kind: "image"` or `kind: "video"`.
- Active trailer snippets and inactive local work clips live in `media/tv-clips/`.
- Current CRT rotation is trailer-only; Blackbird and HELP snippets are kept on disk but not included in `TV_VIDEO_SOURCES`.
- Cleared trailer snippets are normalized to a consistent 960x540 file with a fixed 2.39:1 active image and no added titles.
- Cleared media is split into separate systems:
  - Visual pool: silent, image-first trailer cuts for normal TV rotation.
  - Vocal sample pool: audio-only stems/chops triggered by the explicit `vocal` lane.
- Current TV video pool is visual-only; vocal sample counts live in `app.jsx`.
- Winter Olympics and Santa Clauses derivatives are kept on disk but inactive for now.
- Star Wars clips are the dominant reel language. The active manifest starts on the curated Mando/Grogu trailer reel, not an episodic/title-card cut. Non-Star-Wars clips are tagged as a `guest` reel and grouped into two-clip blocks by the picker, then forced back to Star Wars with a cooldown so the TV never gets stuck in guest mode.
- May 22 curation removed weak character-head and title-card cuts from the active manifest, including the non-graphic Obi-Wan closeup `cleared-obi-wan-06`, the Obi-Wan `cleared-obi-wan-08` saber-to-character beat, the Mando/Grogu table-room beat `cleared-mandalorian-grogu-08`, the front-of-trailer Obi-Wan villain shot, the `On March 1` Mandalorian S3 title card, the Creator glasses/person cuts, the Andor corridor/object inserts, and the alien/person cut around the Grogu pod beat. The Mando/Grogu trailer now uses explicit selected take numbers so `cleared-mandalorian-grogu-31`, `cleared-mandalorian-grogu-69`, the new snake-dragon pull `cleared-mandalorian-grogu-70`, Hutt closeup, swamp creature, Grogu swamp beat, water-creature beat, explosion, cockpit, and space-flight clips are favored over weaker episodic clips. The Creator guest reel was rebuilt from stronger graphic/wide/action pulls: laser fire, mountain wreckage, tech interiors, base-scale wides, convoy action, water explosions, low-flying ships, boat combat, and the final silhouette explosion before the title. The app manifest can use explicit `takes` arrays or `skip` entries so stale files on R2 do not come back into rotation.
- Rights-cleared trailer import slots live in `media/cleared/`.
- Optional cleared trailer sources are probed with `HEAD` on load. Missing files are skipped quietly.
- The TV emits `resume-tv-clip-cue` when a video clip mounts, carrying `project`, `cue`, `sampleKey`, and `lane`.
- Bass lane hits drive CRT tracking/noise.
- Snare/clap lane hits drive full static channel flips and choose a new trailer clip from the cleared video pool.
- Clap/snare flips use extreme CRT tracking tears with a lighter noise layer rather than a full-screen static card; the clip that lands afterward returns to the normalized cinematic matte.
- Bass lane hits drive horizontal CRT image shake and the rolling black sync band. The visual amplitude is derived from the audible bass path: bass fader, master fader, mute/solo state, a floored scroll-layer gain, and any trigger velocity from Strudel. Do not hard-gate the event on scroll-layer volume; keep a floor so the CRT still responds when bass is present.

Clip curation workflow:

- Generate review contact sheets into `review/contact-sheets/` from active `media/tv-clips/` cuts before removing or adding clips.
- Keep rejected clips reversible by moving them to `review/removed-tv-clips-YYYY-MM-DD/`.
- If old files may still exist on R2, exclude them through `skip` entries in `CLEARED_TRAILER_GROUPS`; do not rely on missing local files.
- After every manifest or clip curation pass, run `npm run check:tv-clips` before shipping. The check expands the active app manifest, verifies every local file exists, and HEAD-checks every production R2 URL for `200`, byte-range support, and immutable cache headers.
- Normalize new silent Mac/TV video cuts as 960x540, 24 fps, grayscale, no audio, with the source trailer's cinematic matte preserved:

```bash
ffmpeg -y -ss <start> -t <duration> -i <source.mp4> -an \
  -vf "fps=24,scale=960:540:force_original_aspect_ratio=increase,crop=960:540,hue=s=0,format=yuv420p" \
  -c:v libx264 -preset medium -crf 22 -movflags +faststart \
  media/tv-clips/<clip-name>.mp4
```

Rules:

- Do not rip YouTube/IP trailers directly into the repo.
- Use user-provided or licensed downloadable files for any trailer samples.
- Keep TV clips muted by default; Strudel owns the site score and the separate vocal-sample lane.
- Do not play dialogue as TV video clips. Vocal hooks are audio-only samples so the screen never freezes on a bad/title frame after a line.

## Stem-Separated Vocal Sample Pipeline

Purpose:

The vocal layer should feel like part of the authored world, not random trailer audio. Use it as a Kanye/Fred-again-inspired sampler lane: speech fragments, phrase-first hooks, short micro-chops, pitch/rate variation, call-and-response with the instrumental, and deliberate breakdown-only placement.

Current implementation:

- Source downloads and full-quality working cuts live in `media/source-vocals/`.
- Demucs outputs live in `media/stems/`.
- Web-ready isolated vocal stems live in `media/audio/vocal-stems/`.
- These paths are gitignored. Production deployment requires uploading the final web stems to R2 under the same `media/audio/vocal-stems/` path.
- `app.jsx` defines `CURATED_VOCAL_LINES` with `phrases` and `chops` metadata. Offsets are seconds into the isolated vocal-stem file.
- Vocal metadata can also define `callPhrases`, `answerPhrases`, and `responseSampleKey`. The pre-chorus triggers call phrases; the breakdown answers with the paired response sample when available, otherwise with the same sample's answer pool.
- Vocal metadata can define `callPattern` and `answerPattern` for produced arrangements. Pattern entries can trigger the selected phrase, a named chop, rate/pan changes, and dusty or ghost textures.
- Run a Whisper pass across the full stem before authoring regions, then render every configured chop to temp audio and transcribe those snippets again. If Whisper cannot identify the intended word or phrase, lengthen the cut to a musical word group or remove that chop.
- `TvHero` receives `vocalSamples` separately from `sources`. The Mac/TV visual pool remains silent.
- Vocal playback uses Web Audio buffer sources so a phrase can start/stop at exact offsets without seeking a `<video>` element.
- Vocal cues emit the normalized MIDI lane `vocal` on channel 16 so future hardware, visualizers, and external MIDI routing can follow the sample events.
- The REPL default source includes inert Strudel-style `vocalCall`,
  `vocalAnswer`, and `vocalChops` patterns. They do not duplicate audio;
  they document the current WebAudio vocal-sampler composition and give
  real vocal MIDI events words to highlight in the editor.
- REPL baseline behavior should match Strudel live coding unless a feature
  is impossible in Strudel or is explicitly part of this site's custom
  visual/MIDI layer. Apply / Ctrl+Enter evaluates the new pattern without
  stop/hush/reset when audio is already playing. Ctrl+. hushes. Only a
  cold start should reset the transport. Error recovery should also keep
  the current transport position unless the caller explicitly requested a
  reset.
- Evaluate flashes the whole editor briefly, matching Strudel's REPL
  feedback. Runtime token highlights come from `pattern.draw(...)` hap
  source locations, including every active location Strudel attaches to
  the event. MIDI fallback highlighting is reserved for custom site-only
  lanes such as the WebAudio vocal sampler bridge.
- Token highlights continue while the user edits. The highlighter keeps
  the last evaluated source as the source-location basis and remaps those
  locations into the current draft until Ctrl+Enter evaluates the new
  source.
- The site adds compatibility aliases for common Strudel CodeMirror widget
  helpers such as `._scope()` so live-edited code can use familiar Strudel
  syntax even though this page is not embedding Strudel's full editor UI.
  `_scope()`, `scope()`, `fscope()`, and `_fscope()` create an inline-style
  oscilloscope canvas beneath the line where the scope call appears.
- Current breakdown window follows the active Strudel arrangement: 40 cycles total, breakdown starts at cycle 32 and ends at cycle 40.
- Mac screen bass response uses the `bass` lane event directly: each bass hit advances a persistent CRT roll phase, draws a short black sync band, and applies a brief, strong sideways tracking shake from the same scheduled hit so the motion feels locked to the bassline.

Tooling:

- Primary separator: Demucs `htdemucs_ft`, open-source PyTorch source separation from Meta/Facebook Research.
- Current reusable local runner: `review/.venv-demucs/bin/python -m demucs`. The venv is intentionally under `review/` so it stays ignored and reusable without polluting the project.
- The current Homebrew Python is externally managed, so do not reinstall Demucs globally. Reuse the local venv, or recreate it under `review/.venv-demucs` if that folder is missing.
- Reusable local command:

```bash
review/.venv-demucs/bin/python -m demucs \
  -n htdemucs_ft \
  --two-stems vocals \
  -o media/stems/<session-name> \
  media/source-vocals/<source-cut>.m4a
```

- Alternate disposable runner if the local venv is unavailable:

```bash
uvx --python 3.10 --with torchcodec demucs \
  -n htdemucs_ft \
  --two-stems vocals \
  -o media/stems/<session-name> \
  media/source-vocals/<source-cut>.m4a
```

- Render a browser-ready isolated vocal stem:

```bash
ffmpeg -y \
  -i media/stems/<session-name>/htdemucs_ft/<source-cut>/vocals.wav \
  -ac 1 -ar 48000 -c:a aac -b:a 160k \
  -af "highpass=f=110,lowpass=f=11200,acompressor=threshold=0.05:ratio=2.2:attack=4:release=90:makeup=1.5,loudnorm=I=-18:TP=-1.4:LRA=8" \
  media/audio/vocal-stems/<sample-key>.m4a
```

Current craft/inspiration sample:

- Source: `Steve Jobs Secrets of Life`, timestamp around `00:39`.
- Local source cut: `media/source-vocals/jobs-secrets-life-39.m4a`.
- Stem output: `media/stems/jobs-secrets-life/htdemucs_ft/jobs-secrets-life-39/vocals.wav`.
- Web stem: `media/audio/vocal-stems/vocal-jobs-secrets-life-clean.m4a`.
- Phrase/chop metadata lives in `app.jsx` under sample key `vocal-jobs-secrets-life`.
- Editorial thesis for this sample: things are made by people no smarter than you, so you can make the tools, worlds, and systems you want to see.
- Current breakdown edit: full phrase `everything ... was made up by people that were no smarter than you`, chopped echo `made up by people / no smarter than you / change it / build your own things / other people can use`, then the landing phrase `you can build your own things that other people can use`.
- Current call/response behavior: pre-chorus asks with phrases like `life can be much broader`, `what do we stand for`, or `the ones who see things differently`; breakdown answers with `you can build your own things`, `this is the way`, `you're ready to fight`, `because they change things`, or other paired response phrases.
- Current produced chop pattern uses phrase-level word groups instead of brittle one-word cuts. Repeated fragments are intentional: they make the speech behave like an instrument before completing the thought, while keeping starts and endings clean.
- Producer translation: Dilla-inspired microtiming is handled as small per-hit offsets rather than a global quantize. Madlib-inspired texture is handled with lower-gain ghost/dust fragments and filtered edges. Kanye-inspired hook construction is handled with obvious call/response, pitched/rate-shifted repeats, and a landing phrase that resolves the thought.
- Word chops must be retimed against caption word boundaries and rendered with short fades. Avoid letting a chop bleed into the next sentence just because it feels musically long.
- Additional processed sources: `Apple Think Different` / `Here's To The Crazy Ones`, web stem `media/audio/vocal-stems/vocal-jobs-crazy-ones.m4a`, sample key `vocal-jobs-crazy-ones`; `Kanye West / Sway interview clip`, clean speech stem `media/audio/vocal-stems/vocal-kanye-answers-sway-clean.m4a`, sample key `vocal-kanye-answers-sway`.
- Joker laugh experiments are disabled for the public build until the source can be cut, cleaned, and mixed to the same standard as the quote samples.
- Comedic or overtly referential dialogue sources, including the `Silicon Valley` Jobs/Wozniak exchange, should remain local experiments until they prove they support the thesis rather than turning the public resume into a wink.
- `vocal-jobs-crazy-ones` is authored as a fuller phrase kit rather than a single quote: call phrases establish outsider/creator identity, answer phrases land on consequence and agency, and the chop pattern recombines short word groups rhythmically without losing the source meaning.

Design rules:

- Prefer meaningful spoken fragments related to craft, authorship, making, technology, and creative agency.
- Start with the message. Chops are there to compress, repeat, and rhythmically underline the idea, not to prove the sampler works.
- Cut phrases at the start of the spoken word, not at rough video timestamps.
- Use full phrases sparingly on strong downbeats during breakdowns.
- Use micro-chops as syncopated fills, never as a constant chatter layer.
- Keep title-card/video visuals out of the vocal system.
- If a vocal sounds iconic but visually bad, keep the audio stem and pair it with an unrelated silent TV cut.

## Media And Hosting

Static site:

- Cloudflare Pages for `Resume.html`, JS, CSS, vendor libraries, and small assets.

Large media:

- Cloudflare R2 for large video files.
- Production media domain: `media.tawfeeqmartin.com`.
- Local preview should continue using local `media/...` URLs where possible.

Guardrails:

- Do not deploy large videos as Pages assets.
- Keep huge source files out of normal Git history unless Git LFS is intentionally adopted.
- Configure CORS for the site origins.
- Confirm range requests work.
- Add cache rules for media.
- Add WAF/rate limiting for the media host.
- Add budget alerts before public launch.

More go-live details live in `GO_LIVE_NOTES.md`.

## Mobile Rules

Mobile is not a smaller desktop. It needs its own layout logic.

Rules:

- Header interactive text should use one or two clean columns, not a crushed desktop layout.
- Drawing titles and labels must remain readable.
- Section shape markers must not be clipped on the left edge.
- Video controls on mobile must use the same icon language as desktop.
- HELP controls should not show WASD text on touch devices.
- Fullscreen behavior must be tested in portrait and landscape.
- Avoid random whitespace between sections.
- If a section becomes too long, change layout rather than shrinking text into unreadability.

## Accessibility And User Control

Baseline expectations:

- Audio is opt-in.
- Video audio is user-initiated.
- Site music ducks/stops when video audio plays.
- Page visibility should pause nonessential playback.
- `prefers-reduced-motion` should reduce animation intensity.
- Controls need real buttons and aria labels even when the visible UI is icon-only.
- Keyboard interactions should not hijack typing in inputs/textareas.

## Verification Checklist

Before calling a change done:

- Run local preview and test in a browser.
- Check browser console for runtime errors.
- Test desktop width and mobile width.
- Verify the header loads and page transitions work.
- Verify discovery boxes and connector lines render on first load.
- Verify sound toggle state is clear.
- Verify live Strudel events still drive visual subscribers.
- Verify video controls on flat videos.
- Verify HELP player desktop playback.
- Verify page visibility/background behavior for audio and video.
- Run `git diff --check`.

For audio/MIDI work:

- Confirm `resume-midi-event` fires.
- Confirm lane/channel/note mapping is correct.
- Confirm the visual subscriber is using the normalized event, not a timer fallback.
- Confirm mute/ducking behavior still works.

For media/hosting work:

- Confirm local URLs still work.
- Confirm production media URLs work.
- Confirm range requests and CORS.
- Do not push/deploy large media without cost guardrails.

## Reuse Pattern For Future Sites

For future sites like this, preserve the architecture:

- One editorial thesis expressed as an interactive system.
- One static-friendly page shell.
- One component file or app layer.
- One media resolver for local vs production assets.
- One optional audio engine.
- One normalized event bus.
- Many visual subscribers.
- Every animation that claims to be musical should subscribe to music events.
- Every video player should coordinate with the global audio state.
- Every technical drawing should be researched enough that it can carry credibility.

The goal is not to make a template that looks identical each time. The goal is to keep the same craft discipline: clear concept, credible source material, precise interaction, disciplined media loading, and a single shared timing system.
