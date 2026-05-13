# Hero Diagram Research Audit

Status: local working note. Do not treat color fills as decoration unless the region corresponds to a real element in the represented system.

## Source Anchors

- Euclid I.1: equilateral triangle construction uses two equal-radius circles centered at A and B; C is an intersection, so AB = AC = BC.
  Source: https://aleph0.clarku.edu/~djoyce/elements/bookI/propI1.html
- Euclid I.47: Pythagorean theorem is shown by squares constructed on the two legs and the hypotenuse of a right triangle.
  Source: https://euclid.geometor.com/elements/book-1/propositions/proposition-47
- Snell / prism optics: incident ray, refracted ray, prism/surface normal, and spectrum/dispersion are valid visual elements.
  Source: https://www.britannica.com/science/Snells-law
- Alberti / perspective: picture plane, horizon/vanishing point, and converging projection lines are valid visual elements.
  Source: https://commons.wikimedia.org/wiki/File:Della_Pittura_Alberti_perspective_vanishing_point.jpg
- Turing machine: tape squares, read/write head/state, and transition rules are valid visual elements.
  Source: https://www.alanturing.net/turing_archive/pages/Reference%20Articles/What%20is%20a%20Turing%20Machine.html
- Shannon communication model: source/transmitter/channel/receiver/destination and entropy are valid references.
  Source: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
- Licklider: human-machine symbiosis should read as a cooperative loop, not a neural-network diagram.
  Source: https://groups.csail.mit.edu/medg/people/psz/Licklider.html
- Rendering equation: camera rays, surface/light paths, BRDF/incoming/outgoing light, and integration over directions are valid elements.
  Source: https://doi.org/10.1145/15886.15902
- Light field rendering: two-plane parameterization and 4D light field L(u,v,s,t) are valid elements.
  Source: https://graphics.stanford.edu/papers/light/
- Calculus: tangent/secant slope and area under a curve are valid visual elements for derivative/integral.
  Source: https://www.britannica.com/science/calculus-mathematics
- Interaction: input/output with feedback is the valid reference for interface diagrams.
  Source: https://www.microsoft.com/en-us/research/publication/inputoutput-devices-interaction-techniques/
- Sketchpad: CRT display, light pen interaction, line/circle geometry, and constraints are valid visual elements.
  Source: https://www.britannica.com/technology/Sketchpad
- Pepper's Ghost: audience sightline, angled glass, hidden stage/room, and reflected virtual image are valid visual elements.
  Source: https://optical-illusions.fandom.com/wiki/Pepper%27s_Ghost
- Virtual production volume: LED wall/volume, camera tracking, and camera frustum are valid visual elements.
  Source: https://www.envisioning.com/research/prism/virtual-production-volumes
- Transformer attention: Q, K, V matrices and softmax(QK^T / sqrt(d_k))V are valid elements.
  Source: https://arxiv.org/abs/1706.03762

## Drawing Checklist

- `euclid`: Shows segment AB, equal-radius circles centered at A and B, intersection C, and triangle ABC. Coordinates satisfy AB = AC = BC.
- `pythagoras`: Shows a right triangle and three squares constructed on its sides. Square coordinates match the leg and hypotenuse vectors.
- `calculus`: Shows axes, continuous curve, tangent/secant slope, sample strips, and area under the curve.
- `light`: Shows prism/interface, incident ray, refracted/dispersed rays, wavelength labels, and Snell formula.
- `perspective`: Shows picture planes, horizon line, vanishing point, and converging projection rays.
- `computation`: Uses the Shannon source-transmitter-channel-receiver-destination model with a noise source.
- `network`: Shows Licklider-style human-display-computer feedback, not an artificial neural network.
- `graphics`: Shows a rendering-equation setup: surface point, normal, incoming radiance, outgoing camera ray, and BRDF/integration formula.
- `lightfield`: Shows the two-plane parameterization with camera plane `(u,v)`, image plane `(s,t)`, and crossing rays.
- `interface`: Shows Sketchpad-style CRT display, constrained circle/lines, cursor, and light pen.
- `stage`: Shows Pepper's Ghost with angled glass, audience, hidden stage, reflected sightline, and virtual image.
- `volume`: Shows tracked lens/camera point, viewing frustum, LED volume/wall, and sync notes.
- `prototype`: Shows a process/evidence loop, not a math diagram. Filled blocks are process states.
- `neural`: Shows feed-forward layers, edges, output, and backpropagation reference.
- `ai`: Shows Q, K, V lanes, attention links, and the scaled dot-product attention formula.
- `story`: Conceptual systems loop; keep it honest as a path/loop connecting story, geometry, light, code, and crew.
