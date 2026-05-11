# Blackout Header Research Spine

Goal: make the header feel like ordered chaos: a stack of technical reference pages that moves from geometry and optics through computation, realtime image systems, production craft, and AI. The on-screen copy should be paraphrased and designed, not quoted.

Reference chain:

- Euclid, Elements, Book I: points, lines, circles, common notions, constructive proof, equilateral triangle.
- Pythagorean geometry: proportion, distance, diagonal reasoning, spatial trust.
- Calculus: limits, derivatives, integrals, motion, sampling, animation timing.
- Newton, Opticks: rays, prisms, dispersion, image formation, color as experiment.
- Linear perspective: picture plane, observer position, vanishing points, camera/frustum logic.
- Turing, On Computable Numbers: symbolic procedure, machine table, universal machine.
- Shannon, A Mathematical Theory of Communication: entropy, channel, noise, coding, uncertainty as engineering material.
- Licklider, Man-Computer Symbiosis: interactive computing, time-sharing, human/machine collaboration.
- Kajiya, The Rendering Equation: light transport, radiance, surfaces, sampling.
- Cook/Porter/Carpenter, distributed ray tracing: sampling dimensions for motion blur, depth of field, soft shadows.
- Levoy/Hanrahan, Light Field Rendering: 4D light field, view synthesis by resampling rays.
- Rumelhart/Hinton/Williams, back-propagation: hidden representations learned through error correction.
- Vaswani et al., Attention Is All You Need: transformer self-attention, context, token relations.
- NeRF: learned continuous radiance fields, view synthesis, differentiable volume rendering.

Portfolio phrases to keep threading through:

- make believe
- hello world
- creative technologist
- use technology to tell tales
- interactive illustrations
- real-time cinematic systems
- virtual production engineer
- tools for impossible shots
- shape light into signal
- physics meets performance
- attention becomes interface
- learn representations
- learn through correction
- test the riskiest assumption
- find poetry in proof
- poetry in proof
- i wish i did that

Design notes:

- Avoid a single universal layout. Each page should have its own structure: proof plate, formula sheet, lab note, terminal, network map, render schematic, diff patch, cue sheet, attention matrix.
- The historical sequence should be legible on repeat viewing, but the first impression should remain busy and alive.
- Use diagrams as atmosphere and structure, not literal textbook reproductions.
- Current visual direction: Bauhaus-inflected plates where the drawing is part of the page, not a passive background. Text should wrap around, surround, or frame the illustration.
- Layout direction: use a Pretext-style manual line layout, with per-row available width calculated from illustration exclusion zones. The current static prototype uses a local approximation so the offline static site keeps running without a bundler; replace this with `@chenglou/pretext` if/when the project moves to a build step.

## Current Header Direction

The header is becoming the thesis for the portfolio: finding poetry in proof. It should feel like a live technical notebook where deep reference material, diagrams, code, and terminal language collapse into small poetic discoveries. The visitor should not see generic personal branding first; they should see a working mixed-media system that demonstrates creative technology as taste, timing, and technical elegance.

Core metaphor:

- Find elegance inside the proof.
- Remove the bells and whistles that distract from the idea.
- Build the moment where another maker thinks: "i wish i did that."

Interaction language:

- The title `poetry in proof` types out letter by letter with a terminal-style block cursor.
- The phrase pages cycle on a fixed musical grid.
- Selected words are boxed in the actual copy, not overlaid as labels.
- Portfolio phrase words should earn their place inside the source copy. The copy must read as credible technical prose without the phrase animation. Prefer swapping in the portfolio word only when it is a natural synonym in the technical sentence. Discovery reconstructs the phrase from authored target words spread across related technical copy; do not plant the whole phrase as a slogan in one sentence.
- Dotted arrow lines connect the boxed words in reading sequence across columns.
- Lines should never occlude target words; they start/end outside the boxed word bounds.
- Diagrams should remain crisp, mathematical, and confident, with formulas and coordinate labels where useful.

Audio direction:

- Sound is optional and user-armed because browser autoplay rules require interaction.
- Current prototype routes the site through vendored Strudel (`vendor/strudel-web.mjs`) instead of the hand-rolled generative Web Audio sequencer.
- Everything should share the active Strudel clock and remain quantized to musical pattern time.
- Compose tracks as Strudel pattern strings first; avoid hidden melody mutation rules.
- Stutter-house lead ideas should be written as explicit chopped note cells with rests and retriggers.
- Dotted phrase-line timing should imply alternating bass motion.
- Diagram draw timing should feel like synth melody notes entering on the grid.
- WASD should inject an in-key chord pad layer once sound is armed.

Sound palette reference, not imitation:

- Original analog-synth/trap-adjacent feel.
- Public Mike Dean references suggest heavy analog synths, Moog/Oberheim/CS-80-style expressiveness, layered low-end, psychedelic/prog instrumental energy, and live performance gestures.
- Do not clone a specific Mike Dean track. Translate the broad vocabulary into an original resume instrument.
- Strudel trap study should start from a real harmonic frame, not random note cells. Current first-pass target is a dark C minor 6-2-5-1 turnaround: `Abmaj7 -> Dm7b5 -> G7b13 -> Cm9`.
- Prefer `chord("<...>").voicing()` for atmospheric pads so transitions feel pianist-led instead of blocky.
- Moog-style Strudel voice recipe: sawtooth or square oscillator, low-pass filter in the 300-900 Hz body range, `lpq` resonance, legato/slide overlap, saturation/distortion, and large room.
- Lead solo recipe: one coherent sawtooth voice, `legato` greater than 1, `slide`, animated filter with `sine.range(...).slow(...)`, high `lpq`, saturation, reverb, and panning. Avoid stacking multiple unrelated lead patterns.
- Trap drums can use `bank("RolandTR808")` when available, backed by synthesized sine/noise drums so the site still produces sound if sample loading is inconsistent.
- Add controlled instability with slow `detune(sine.range(...))` drift on synth layers, while leaving drums comparatively dry and stable.
- Use a quiet high-room halo/melodic layer for the cinematic outro feel, but keep it below the main lead and chords so it reads as space rather than another competing hook.
- Avoid tempo/beat-switch tricks until the visual phrase timing has a stronger transport abstraction; abrupt `hurry()`/`slowly()` changes can fight the page-cycle grid.
- Bass should be its own layered Strudel lane: detuned sawtooth voices panned left/right for harmonic width plus a centered square sub layer, then shared portamento/glide, low-pass resonance, high-pass cleanup around 25 Hz, saturation, and light shaping.
- Lead/outro solo should feel more like a processed vocal guitar than a clean synth: distorted saw foundation, legato near 1.8, wide filter sweep, strong resonance, vibrato, delay feedback, room/size, plus quiet fifth and octave harmony layers.
- Keep the mix readable before adding spectacle. The first overprocessed pass buried drums, bass, and chords with long delay feedback, huge room, heavy distortion, and multiple patterned gain stages. Current baseline should favor short delay, moderate room, restrained distortion, no halo layer, and clear drums/bass/chords before solo effects are increased.
- Add high ethereal melodic layers as separate quiet lanes, not by overprocessing the main lead. Target: angelic triangle/sine register above the chords, short stutter cells, gentle vibrato, high-pass around 1.2 kHz, moderate room, and very low delay feedback so it floats without masking drums, bass, or chord movement.
- For the high angel lane, prefer a harp-like plucked synth over a sustained triangle tone: fast attack, short decay, almost no sustain, longer release, sine body, light octave sheen, a small saw transient, comb resonance, high-pass cleanup, and restrained room/delay.
- Avoid making the high harp lane read as an arpeggiator. Use mostly single-note melodic phrases with rests, stepwise motion, longer releases, and only rare octave shimmer.
- The middle synth should answer the harp as a counter-melody, not compete as a second arp. Keep it lower, slower, mostly monophonic, with longer values and fewer harmony layers.
- Bass must support melody first. Avoid busy/percussive bass fills that read like extra drums; default to long root tones following the harmonic frame, currently `Ab -> D -> G -> C` for the C minor 6-2-5-1.
- To move from loop to song, use call/response melody form: middle synth states a slower lower-register phrase, high harp answers after space, and a quiet build layer enters later rather than every cycle. Remove trap melodic chop/arp lanes when they compete with that form.
- Browser-synth bass should avoid broken-speaker artifacts. If the sub layer distorts on laptop speakers, raise the line into a safer octave, remove square/saw sub layers, remove distortion/shape, and use a clean sine body with only a tiny triangle harmonic.
- Song form pass: use Strudel section masks over the trap arrangement so it stops behaving like one static loop. Chords establish the intro, bass/drums enter, middle lead states the call, harp answers, and a quiet build line enters late before the form resets.
- WASD override should use the same chord identities as autoplay, routed through `chord().voicing()` rather than manual low note stacks: `Ab^7`, `Dm7b5`, `G7b13`, `Cm9`. Mute the autoplay bass while WASD is active so the user only hears the chord pad override against the arrangement.
- Switch-up pass: extend trap form to an eight-section cycle. Keep the harmony inside a cleaner C minor palette when the melody is exposed: `Ab^7 -> Fm9 -> Gm7 -> Cm9`. Earlier `G7b13` dominant tension and FM sidebands made the lead feel out of key on laptop playback.
- Mid lead should not share the chord pad's saw/pad design. Give it a focused lead identity: square/FM source, band-pass focus, light phaser/vowel color, less room, and a left pan so it separates from the darker chord bed and high harp.
- Melody timing should feel phrased, not like isolated grid taps. Use short motifs with pickup, repetition, and resolution; allow bracketed passing tones sparingly for movement, but avoid continuous arpeggiation.

Open tuning notes:

- The click/thump level must feel normalized at normal MacBook listening levels. The user should not need to max system volume.
- Bass and melody should be subtle enough for a portfolio, but audible enough that the page feels alive.
- Keep the musical pattern prototype in Strudel unless we replace it with rendered audio stems.
