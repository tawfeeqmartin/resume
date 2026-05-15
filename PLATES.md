# Plates — Theory and Drawing

The 16 interactive plates at the top of `tawfeeqmartin.com/Resume` are each a
proof figure: a small Byrne/Euclid-style construction paired with a phrase
revealed across the page. They walk a through-line from classical geometry
to virtual production to modern AI — each plate is one "constraint that
shapes the work."

This doc explains, plate by plate, what the underlying idea is, how the
drawing represents it, and a short interview-ready answer.

---

## I. Euclid I.1 — *Equilateral Triangle on AB*

**Phrase shown:** "find poetry in proof"

**Theory.** The very first proposition of Euclid's *Elements*. Given a line
segment AB, construct an equilateral triangle on it. The proof is to draw
two circles of radius AB centred at A and B respectively; they intersect at
C; ABC is equilateral because AC and BC are both radii of circles of radius
AB. The simplest demonstration that geometric truth can be built from
pure construction.

**Drawing.** Two construction circles in red and yellow share the baseline
AB; their lens-shaped intersection (the *vesica piscis*) is filled yellow;
the resulting equilateral triangle ABC is filled blue with strong red /
yellow / black sides; the dotted altitude from C drops to the midpoint of
AB.

**30-second answer.** "It's Euclid I.1 — the construction that says
*you can build an equilateral triangle with a straightedge and compass*.
The circles aren't decoration; they're the proof. To me it's the simplest
example of what I look for in any technical work: a construction that
makes the truth obvious."

---

## II. Pythagoras — *Squares on a Right Triangle (I.47)*

**Phrase shown:** "measure becomes form"

**Theory.** Euclid I.47. The square built on the hypotenuse of a right
triangle equals the sum of the squares on the two legs. The first time in
the *Elements* that **measurement** (length) and **form** (area) are shown
to be the same conversation: a + b → c is not just arithmetic, it's a
geometric identity.

**Drawing.** Right triangle with the right angle at A; legs AB and AC carry
their squares (yellow and blue); the tilted red square sits on the hypotenuse
BC; dotted construction lines complete the hypotenuse square; the soft
construction arc is the circumscribed half-circle whose diameter is BC; a
right-angle marker at A makes the perpendicularity explicit.

**30-second answer.** "Pythagoras as a geometric proof rather than as a
formula. The point of the figure is that the two small squares literally
*are* the big one — measurement becomes form. That's how I tend to think
about engineering work: don't just compute the answer, build a construction
where the answer is visible."

---

## III. Calculus — *Secant Becoming Tangent*

**Phrase shown:** "form follows function"

**Theory.** The classical proof that `lim θ→0  sin θ / θ = 1`. Inside a
quarter circle of radius 1, the inner triangle OAP is strictly contained in
the circular sector OAP, which is strictly contained in the outer triangle
OAT. Their areas are `sin θ / 2`, `θ / 2`, and `tan θ / 2`. As θ → 0 the
three converge — the secant OP becomes the tangent OT and the bound is
tight. The squeeze theorem visualised.

**Drawing.** Three nested shapes share the left edge OA: outer yellow
triangle OAT (the tangent triangle), red circular sector OAP between it
and the chord AP, innermost blue triangle OAP. The quarter arc, the
tangent AT (blue strong), the radius OP (yellow strong), the dotted
secant OT and dotted chord AP, an angle arc at O, and a right-angle
marker at A.

**30-second answer.** "It's the classical squeeze proof: triangle inside a
circular sector inside a bigger triangle. As the angle shrinks, all three
collapse to the same area, which is how you prove `sin θ / θ → 1`. The
diagram says it before any algebra does — *form follows function*, the
geometry tells you what the function is doing in the limit."

---

## IV. Light — *Light Broken by a Triangle*

**Phrase shown:** "shape light into signal"

**Theory.** A triangular prism disperses white light into a spectrum because
each wavelength refracts at a slightly different angle when it crosses an
optical boundary. Snell's law applied twice (entry face and exit face) gives
you a *signal* (a spectrum) from a homogeneous beam.

**Drawing.** A yellow equilateral prism sits centre-stage. A red incoming
ray from source S strikes face A, refracts as a red ray inside the prism,
crosses to face B, and fans out into red / yellow / blue rays toward the
right edge. Dotted normals stand perpendicular to each refracting surface
at A and B.

**30-second answer.** "A prism is a *signal generator* — it takes
broadband light in and gives you wavelength-separated output. Snell's law
at the entry face and the exit face does the work. To me it's the
prototype for every piece of optical instrumentation I've built — shape
light, get signal."

---

## V. Perspective — *Perspective from a Point*

**Phrase shown:** "total work of art"

**Theory.** Linear perspective, the Renaissance discovery that any 3-D scene
collapses onto a 2-D plane by projecting through a single point (the eye, E)
through the picture plane (PP). Parallel lines in the world meet at a
**vanishing point** V on the horizon line — geometry's bridge to picture
making.

**Drawing.** Eye E sits at lower-left, a yellow vertical picture plane
stands at the canvas position, the dotted horizon line runs at eye level
out to the vanishing point V on the right (red dot). Two receding quads
(blue, red) demonstrate parallels converging on V. A right-angle marker on
the picture plane fixes its orientation.

**30-second answer.** "Linear perspective: every parallel in the world
meets at a single vanishing point on the horizon when seen through a single
eye. The picture plane intersects the sight pyramid. It's the geometry of
making a 3-D world fit on a 2-D image — every camera and every renderer is
applying this construction implicitly."

---

## VI. Computation — *Finite Symbol Machine*

**Phrase shown:** "hello world"

**Theory.** Alan Turing's 1936 abstract machine. An infinite tape of cells,
each cell holding one symbol from a finite alphabet; a head that reads,
writes, and steps left or right; a finite state controller. Anything
computable can be computed by a machine of this shape. The conceptual
foundation of every program ever written.

**Drawing.** Six tape cells (alternating yellow, blue, red) sit on a strong
black rail. A small red triangular head H points at the centre cell. Above
the head, a filled blue state box S sits, connected to the head by a
strong red "scanning" line. Dotted segments extend the tape both
directions (α … ω) and a dotted execution thread runs beneath.

**30-second answer.** "Turing's machine — a tape of symbols, a head that
reads and writes, a finite state controller. Anything computable can be
computed by something this simple, which is why it's the conceptual
foundation for every programming language and CPU. The plate keeps the
machine small so the *finiteness* reads."

---

## VII. Network — *Mean Proportional Between Two Lines (VI.13)*

**Phrase shown:** "feedback returns while thought is still forming"

**Theory.** Euclid VI.13 — given two line segments AB and BC, construct the
**mean proportional** BD so that AB : BD = BD : BC. Geometrically: draw the
semicircle on AC, drop a perpendicular at B; its height is √(AB · BC).
Used here as a metaphor for Licklider's *Man-Computer Symbiosis*: a third
quantity emerges from the relation between two — the partnership is
geometrically real, not metaphorical.

**Drawing.** Baseline AC with B dividing it into AB (yellow) and BC (blue).
The semicircle on AC encloses both. The perpendicular BD rises from B to D
on the arc; BD² = AB · BC. The two sub-triangles ABD and DBC are similar
to each other and to ACD (Euclid VI.8). Right-angle marker at B; tick
marks emphasise the two unequal segments.

**30-second answer.** "Euclid's mean proportional: between two segments
there's always a third whose square is their product, and you can construct
it with one perpendicular and one semicircle. I use it as the figure for
human-machine partnership — the *third thing*, the symbiosis, isn't
metaphor, it's actually constructible from the two extremes."

---

## VIII. Graphics — *Hemisphere of Directions at a Point*

**Phrase shown:** "physics meets performance"

**Theory.** Kajiya's 1986 rendering equation: the outgoing radiance at a
surface point P in direction V equals the emitted radiance plus the
integral over the hemisphere of all incoming radiances multiplied by the
surface's bidirectional reflectance function and the cosine of the angle
to the normal. Geometrically, every shading calculation is a hemisphere
integral.

**Drawing.** Surface as a strong black baseline (left half yellow patch,
right half blue patch). Semicircle above P is the hemisphere of directions.
Three yellow rays converge from the sky onto P (sampled incoming
directions); a strong red ray V leaves P toward the viewer; the normal N is
the dotted vertical. A yellow disk on the dominant incoming ray L marks the
light source; a red disk on V marks the viewer. Small arcs at P show the
incidence/view angles.

**30-second answer.** "The rendering equation says shading at a point is a
hemisphere integral — every shading model is some approximation of summing
incoming light times surface response times the cosine over the dome of
directions. The plate makes the dome explicit so the integral has somewhere
to live."

---

## IX. Lightfield — *Two Parallels Parameterize a Field of Rays*

**Phrase shown:** "sample possible views"

**Theory.** Levoy and Hanrahan, 1996. A light field is the radiance along
every ray in space. In free space it's four-dimensional: every ray is
specified by where it hits two parallel planes. Rendering a novel view
becomes *resampling* this 4-D function rather than re-rendering geometry —
view synthesis without a model. The forerunner of neural radiance fields.

**Drawing.** Two parallel plane bars (blue on top, yellow on bottom) span
the slot. Four named anchor points on each plane (A B C D and A' B' C' D')
with vertical dotted alignment guides. Several yellow and blue rays cross
between named points on the two planes; one strong red ray (B → C') is
emphasised as the *chosen sample*.

**30-second answer.** "Light field rendering says: don't reconstruct
geometry, just sample the rays. Two parallel planes parameterize a 4-D
function — pick a pair of (u,v) and (s,t) and you've named a unique ray. A
novel view is a *resample* of that function. It's the foundation that NeRF
and Gaussian splatting eventually generalised."

---

## X. Interface — *Diagram as Instrument*

**Phrase shown:** "the diagram learned to listen"

**Theory.** A diagram becomes useful when you can *test* the idea with it,
not just look at it. Interactive illustrations let the relationships move
instead of merely sit. The principle behind every demo, simulator, and
operator panel — make the geometry of the idea touchable.

**Drawing.** A control disc at origin O is sectored into three regions
(red, yellow, blue) covering the upper hemisphere. Dotted radii divide the
sectors. A strong yellow pointer arm OP swings outward through the
sectors; a red gesture vector PG continues outward to G with a soft trace
arc behind it — the user's drag.

**30-second answer.** "The best interfaces are diagrams that listen — you
can disturb the figure and it stays coherent. The plate shows a control
disc with a pointer being dragged through sectored regions. It's the
abstraction of any direct-manipulation tool I've ever built, from
StageCraft to the agiftoftime cube."

---

## XI. Stage — *Light, Figure, Audience*

**Phrase shown:** "use technology to tell tales"

**Theory.** Stagecraft is technology in service of story. The apparatus — a
lamp, a mirror, a screen, a sensor — produces a moment of attention; the
trick is the moment the audience stops seeing the machine. Light, focused
on a figure, watched by an audience.

**Drawing.** A yellow cone of light descends from lamp L (red disk, upper
left) onto a lit patch of the stage floor where a blue figure A stands.
The stage edge S is a strong black horizontal. The audience eye E (blue
disk) sits lower-right; a dotted red sightline travels from E up to the
figure. A dotted construction normal rises from the stage at the actor's
mark.

**30-second answer.** "Three elements is enough for any piece of
stagecraft: a lamp, a figure, an audience. The lamp focuses attention; the
figure receives it; the audience completes the loop. Every piece of stage
technology I've built — from on-set 360° rigs to LED volumes — is
some version of this triangle."

---

## XII. Volume — *Frustum of a Viewing Volume*

**Phrase shown:** "attention belongs on performance"

**Theory.** A virtual production volume (LED stage, in-camera VFX) is
defined by the **camera frustum** — the pyramid of space the camera can
actually see. Rendering only the inside of that pyramid, in real time, on
the LED walls, is what makes the stage appear photoreal in-camera. Outside
the frustum, pixels are wasted; inside, they are story.

**Drawing.** A camera C (small black-body figure) at left looks into a
truncated pyramid: near plane (dotted), red top face, blue back face,
yellow floor. Four sight rays from C trace the corners of the frustum.
Strong black outlines mark the frustum edges. Labels A, B, C', D mark the
far face corners.

**30-second answer.** "Virtual production lives or dies on the frustum.
The LED volume only needs to render what the camera actually sees — the
pyramid behind the lens. Frustum-aware rendering is the whole reason an
in-camera VFX stage is photoreal, and it's the difference between a tool
that helps story and one that fights it."

---

## XIII. Prototype — *Prototype as Construction (VI.1)*

**Phrase shown:** "test the riskiest assumption"

**Theory.** Euclid VI.1: triangles between the same parallels with the same
base have proportional areas. Used here as the figure for *iteration* — each
prototype is a similar triangle on the same baseline, with its apex on the
same parallel. Versions A, B, C are not arbitrary; they're proportional
experiments. The riskiest assumption sits at the apex; the construction
either lands on the parallel or it doesn't.

**Drawing.** Three similar triangles (yellow, blue, red) share the strong
black baseline 0..n. Their apexes A, B, C all sit on a dotted upper
parallel. Through-line connectors travel apex-to-apex (red strong).
Altitudes from each apex drop to the base, each with a right-angle marker
at the foot.

**30-second answer.** "Three iterations on the same baseline, apexes
landing on the same parallel — that's Euclid VI.1 as a model of
prototyping. The point isn't to make many things; the point is to keep
each iteration *proportional* so you're learning the same parameter each
time. The construction tells you whether you tested what you thought you
tested."

---

## XIV. Neural — *Forward Pass and Correction*

**Phrase shown:** "representation emerging from correction"

**Theory.** A feed-forward neural network computes its output by passing
inputs X through hidden layers H₁, H₂ to output Y. Learning happens *in
reverse*: compare Y to the target Y*, propagate the error gradient
backward through the network (backpropagation), and nudge every weight.
Representation isn't designed; it emerges from corrected error.

**Drawing.** Four dotted layer rules (X, H₁, H₂, Y) span vertically. Nodes
sit on the rules; faint inter-layer edges suggest full connectivity. One
strong red **forward path** runs left-to-right through chosen nodes. A
dotted target Y* circle sits to the right of Y. A blue dotted arc curves
underneath from Y back to X with chevron arrowheads at the H₂ and H₁
crossings — the **correction return**.

**30-second answer.** "A neural network is forward computation plus
backward correction. The forward pass produces an output; comparing to the
target gives you an error; the correction propagates back through every
layer and updates every weight. The representation in the hidden layers
isn't designed by anyone — it's what emerges when you keep correcting."

---

## XV. AI — *Attention as Matrix Correspondence*

**Phrase shown:** "attention becomes interface"

**Theory.** Scaled dot-product attention, the operation at the heart of the
Transformer. From an input sequence, project to queries Q, keys K, values
V. Compute attention weights A = softmax(Q · Kᵀ / √dₖ); produce output
C = A · V. Each query token assembles its output by reading a weighted
combination of value tokens. The whole architecture (and every LLM since)
is built on this one figure.

**Drawing.** A blue Q column on the left; a red Kᵀ row above the middle;
their product is the 3×3 attention matrix A — each cell filled at an
opacity equal to its softmax weight, so the matrix is literally a small
heat map (diagonal-dominant with one off-diagonal lift). A yellow V column
to the right of A. The blue C output column on the far right. Dotted
alignment guides drop from Kᵀ into A's columns and extend from Q into A's
rows. Inline operator marks `×  ·  =` between the blocks.

**30-second answer.** "Attention is a matrix operation: queries × keys
gives you a correspondence matrix, softmaxed into weights; weights times
values gives you the output. The whole Transformer is stacks of this one
figure. Once you see attention as a *correspondence table* — every query
choosing how much to read from every value — the interface implications
become obvious: it's a substrate for controllable reading."

---

## XVI. Story — *Extreme and Mean Ratio (VI.30)*

**Phrase shown:** "why didn't I think of that"

**Theory.** Euclid VI.30 — the golden section. Cut a segment AB at C so
that AB : AC = AC : CB. The whole is to the greater as the greater is to
the lesser; the line encodes its own proportion. Used here as the figure
for *story* — one line that contains its own ratio, the inevitability of a
finished work where every part rhymes with the whole.

**Drawing.** Baseline AB with C dividing it: AC (blue, the greater)
followed by CB (red, the lesser). The construction triangle ABD with the
perpendicular BD rises at B; the dotted hypotenuse AD; E on AD locates
the cut at C. Right-angle marker at B. The yellow fill of the construction
triangle frames the figure.

**30-second answer.** "Euclid's golden section: cut a line so the whole is
to the bigger piece as the bigger piece is to the smaller. One line that
contains its own ratio. I use it as the figure for finished work — a story
where every layer rhymes with the whole, and the result feels inevitable
even though you can see exactly how it was built. The reaction *why didn't
I think of that* is the goal of the diagram."

---

## How the plates relate

There's a through-line in the order:

1. **Geometry as the substrate** — Euclid I.1, Pythagoras I.47.
2. **Geometry becomes physical** — calculus (limits → motion), prism
   (light → signal), perspective (3-D → image).
3. **Geometry becomes computational** — Turing's machine, mean proportional
   as symbiosis, the rendering equation, light fields.
4. **Geometry becomes interactive** — diagram as instrument, stagecraft,
   virtual production.
5. **Geometry becomes generative** — prototype as construction, neural
   correction, attention as interface.
6. **Geometry closes back to form** — golden section as the figure for
   story: one line containing its own ratio.

If anyone asks "what's the point of all these diagrams?" the honest answer
is: each one is a *constraint* I keep close to my work. Geometry
constrains space, optics constrains light, computation constrains process,
AI constrains context. Story is what arrives when those constraints stop
being visible.
