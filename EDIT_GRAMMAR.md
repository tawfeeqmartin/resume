# TV Edit Grammar

This is the lightweight editorial system for the Macintosh screen montage.
The site should feel edited, not like a generic visualizer, while staying
cheap enough to run on laptops and phones.

## Core Rule

Do expensive work offline. Runtime only chooses clips and applies simple
timed gestures.

Allowed live work:

- Clip selection by music section and MIDI lane.
- Video play, seek, and playback-rate changes that keep the previous frame live until the next frame is drawable.
- Small canvas crop/punch adjustments that reuse the existing draw pass.
- Short visual hat ticks that leave the video decoder running.
- Bass-driven CRT tracking already present in the Mac screen canvas path.

Avoid live work:

- Per-frame pixel reads.
- Realtime blur, glow, chromatic aberration, datamosh, or large noise passes.
- Heavy WebGL post-processing.
- Any effect that requires decoding additional hidden videos every frame.
- Pausing the active decoder during a musical edit.

## Music Lanes

- `snare`: editorial cut or channel flip. This is the hard edit lane.
- `kick`: no new cuts. It can support physical pressure if needed.
- `bass`: horizontal CRT tracking, sync roll, and body feel.
- `hat`: sparse visual tick only. Never pause the video decoder or cut on every hat.
- `lead`: occasional sparse clip changes in sections without snares.
- `vocal`: short punch-in/freeze language so the picture performs with the chop.

## Song Sections

- `intro`: iconic, wide, establishing, silhouette. Lower energy.
- `chorus`: action, impact, saber, creature, vehicle. Highest energy.
- `verse`: closeups, character beats, objects, screens. Medium energy.
- `preChorus`: anticipation, silhouettes, screens, motion, shatter.
- `breakdown`: close, screen, gesture, noir, warm, silhouette.

## Clip Metadata

Active TV clips carry:

- `visualTags`: editorial labels like `wide`, `close`, `saber`, `vehicle`,
  `creature`, `screen`, `shatter`, `silhouette`, `impact`.
- `shotSize`: `wide`, `medium`, or `close`.
- `energy`: 1-5.

The picker scores candidates by section, lane, energy, current shot continuity,
and recent-project avoidance. This gives match-cut behavior without doing visual
analysis in the browser.

## Offline Clip Prep

Any stronger edit tricks should be rendered into media files first:

- Speed ramps.
- Freeze-frame hits.
- Stutter edits.
- Datamosh-like transitions.
- Vocal picture repeats.
- Aggressive glitch or noise transitions.

Render them as short 960x540 MP4s, grayscale, no audio, faststart enabled, then
tag them in `app.jsx`.

## Verification

Before shipping new TV edits:

```bash
npm run check:tv-clips
npm run build
```

`check:tv-clips` expands the active manifest and checks both local files and
the production R2 URLs.
