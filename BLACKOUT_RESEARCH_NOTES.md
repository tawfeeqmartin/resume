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
- attention becomes interface
- learn representations

Design notes:

- Avoid a single universal layout. Each page should have its own structure: proof plate, formula sheet, lab note, terminal, network map, render schematic, diff patch, cue sheet, attention matrix.
- The historical sequence should be legible on repeat viewing, but the first impression should remain busy and alive.
- Use diagrams as atmosphere and structure, not literal textbook reproductions.
- Current visual direction: Bauhaus-inflected plates where the drawing is part of the page, not a passive background. Text should wrap around, surround, or frame the illustration.
- Layout direction: use a Pretext-style manual line layout, with per-row available width calculated from illustration exclusion zones. The current static prototype uses a local approximation so the offline static site keeps running without a bundler; replace this with `@chenglou/pretext` if/when the project moves to a build step.
