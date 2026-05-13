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

## Visual System

Design direction:

- Frontier white is the default theme.
- Backgrounds should read as actual white, not green-tinted gradients.
- Bauhaus/Oliver Byrne color language is the accent system: yellow, blue, red, black, white.
- Use geometric forms as functional marks, not decoration.
- Keep linework crisp. Avoid glow, soft marker-like strokes, and thick fuzzy drawing lines.
- Technical drawings must be credible, referenced, labeled cleanly, and never feel hallucinated.
- Labels should be small and standardized; drawing titles should be larger and placed consistently.
- Avoid overlapping labels, cropped marks, and inconsistent drawing placement between page turns.

Functional visual motifs:

- Section rails.
- Filled Bauhaus shape markers.
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
```

## Music-Reactive Visuals

Current subscribers:

- Header drawings react to melody, harmony, and drum lanes.
- Discovery word/line timing is tied to music timing.
- Award proof stamps listen to drum lane events.

Award stamp behavior:

- HELP and Blackbird award stamps use small Elements-of-Euclid-inspired diagrams.
- The line art is always visible.
- Interior fills are transparent at rest.
- On the mapped drum hit, the fill snaps to yellow/blue/red.
- Use direct SVG `fill` switching for stamp fills. Do not rely on `opacity` or `fill-opacity`; Chrome did not apply those reliably on these SVG paths during testing.

Manual test hook:

```js
window.__resumeProofStampPulse("kick")
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
