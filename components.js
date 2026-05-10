/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

const THEME_OPTIONS = [
  { label: 'Warm Editorial', className: '' },
  { label: 'Cool Frontier', className: 'theme-frontier' },
  { label: 'Frontier White', className: 'theme-frontier-white' },
  { label: 'StageCraft Green', className: 'theme-stagecraft' },
  { label: 'Projection Noir', className: 'theme-noir' },
];

const FONT_OPTIONS = [
  { label: 'Newsreader + Plex', className: '' },
  { label: 'Instrument + Inter', className: 'font-modern-editorial' },
  { label: 'Technical Plex', className: 'font-technical-exec' },
  { label: 'Cascadia Signal', className: 'font-cascadia-signal' },
  { label: 'Cinematic Archive', className: 'font-cinematic-archive' },
];

function ReviewToggle({ kind, options, classScope }) {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    document.body.classList.remove(...options.map(t => t.className).filter(Boolean));
    const theme = options[themeIndex];
    if (theme.className) document.body.classList.add(theme.className);
  }, [themeIndex, options, classScope]);

  const cycle = (delta) => {
    setThemeIndex((idx) => (idx + delta + options.length) % options.length);
  };

  return (
    <div className="review-toggle" aria-label={`${kind} review`}>
      <button className="review-toggle__button" onClick={() => cycle(-1)} aria-label={`Previous ${kind}`}>‹</button>
      <span className="review-toggle__kind mono">{kind}</span>
      <span className="review-toggle__label mono">{options[themeIndex].label}</span>
      <button className="review-toggle__button" onClick={() => cycle(1)} aria-label={`Next ${kind}`}>›</button>
    </div>
  );
}

function ReviewControls() {
  return (
    <div className="review-controls">
      <ReviewToggle kind="Theme" options={THEME_OPTIONS} classScope="theme" />
      <ReviewToggle kind="Fonts" options={FONT_OPTIONS} classScope="font" />
    </div>
  );
}

const VECTOR_GLYPHS = {
  A: [[[0,6],[0,2],[2,0],[4,2],[4,6]], [[0,3],[4,3]]],
  E: [[[4,0],[0,0],[0,6],[4,6]], [[0,3],[3,3]]],
  F: [[[0,6],[0,0],[4,0]], [[0,3],[3,3]]],
  I: [[[0,0],[4,0]], [[2,0],[2,6]], [[0,6],[4,6]]],
  M: [[[0,6],[0,0],[2,3],[4,0],[4,6]]],
  N: [[[0,6],[0,0],[4,6],[4,0]]],
  Q: [[[1,0],[3,0],[4,1],[4,5],[3,6],[1,6],[0,5],[0,1],[1,0]], [[2.6,4.6],[4.2,6.2]]],
  R: [[[0,6],[0,0],[3,0],[4,1],[4,2.5],[3,3],[0,3]], [[2.2,3],[4,6]]],
  T: [[[0,0],[4,0]], [[2,0],[2,6]]],
  W: [[[0,0],[0.7,6],[2,3.4],[3.3,6],[4,0]]],
};

function VectorNameCanvas({ text }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let raf = 0;
    let start = performance.now();
    let dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      w = Math.max(320, Math.floor(rect.width));
      h = Math.max(96, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const glyphWidth = 5;
    const glyphHeight = 7;
    const gap = 1.35;
    const chars = text.toUpperCase().split('');
    const totalUnits = chars.reduce((sum, ch) => sum + (ch === ' ' ? 3 : glyphWidth) + gap, -gap);

    const project = (x, y, elapsed) => {
      const centered = x - totalUnits / 2;
      const radius = totalUnits * 0.95;
      const theta = centered / radius;
      const curveX = Math.sin(theta) * radius;
      const depth = Math.cos(theta);
      const tilt = 0.34;
      const breathe = Math.sin(elapsed * 0.0016 + x * 0.2) * 0.035;
      return {
        x: w / 2 + curveX * scale,
        y: h / 2 + (y - glyphHeight / 2) * scale + (1 - depth) * scale * glyphHeight * tilt + breathe * scale,
        depth,
      };
    };

    let scale = 1;
    const drawLine = (a, b, drawT, elapsed) => {
      if (drawT <= 0) return;
      const clamped = Math.min(1, drawT);
      const bx = a[0] + (b[0] - a[0]) * clamped;
      const by = a[1] + (b[1] - a[1]) * clamped;
      const p0 = project(a[0], a[1], elapsed);
      const p1 = project(bx, by, elapsed);
      const alpha = 0.52 + p0.depth * 0.38;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    };

    const draw = (now) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      scale = Math.min(w / (totalUnits + 1), h / 8.3);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#65bfc7';
      ctx.lineWidth = Math.max(1.25, scale * 0.1);
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = Math.max(0, scale * 0.055);

      const scan = Math.min(1, elapsed / 1700);
      let cursor = 0;
      let glyphIndex = 0;
      for (const ch of chars) {
        if (ch === ' ') {
          cursor += 3 + gap;
          glyphIndex++;
          continue;
        }
        const glyph = VECTOR_GLYPHS[ch];
        if (!glyph) {
          ctx.save();
          ctx.globalAlpha = scan;
          ctx.shadowBlur = 0;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.font = `${scale * 7}px "Cascadia Code", "IBM Plex Mono", monospace`;
          ctx.fillText(ch, w / 2 + (cursor - totalUnits / 2) * scale, h / 2 + scale * 2.2);
          ctx.restore();
          cursor += glyphWidth + gap;
          glyphIndex++;
          continue;
        }

        const letterStart = glyphIndex / chars.length;
        const letterT = Math.max(0, Math.min(1, (scan - letterStart * 0.72) / 0.22));
        const glitch = Math.sin(elapsed * 0.018 + glyphIndex * 7) > 0.985 ? 0.1 : 0;
        ctx.save();
        if (glitch) ctx.translate(glitch * scale, 0);
        for (const poly of glyph) {
          for (let i = 0; i < poly.length - 1; i++) {
            const segmentT = letterT * poly.length - i;
            const a = [cursor + poly[i][0], poly[i][1]];
            const b = [cursor + poly[i + 1][0], poly[i + 1][1]];
            drawLine(a, b, segmentT, elapsed);
          }
        }
        ctx.restore();
        cursor += glyphWidth + gap;
        glyphIndex++;
      }

      ctx.shadowBlur = 0;
      const cursorX = Math.min(totalUnits, totalUnits * scan);
      const p0 = project(cursorX, -0.2, elapsed);
      const p1 = project(cursorX, glyphHeight + 0.2, elapsed);
      ctx.globalAlpha = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * 0.006));
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text]);

  return (
    <div ref={wrapRef} className="identity__vector-name" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

const BLACKOUT_PAGES = [
  {
    diagram: "euclid",
    layout: "plate",
    mark: "highlight",
    phrase: { label: "make believe", words: ["make", "believe"] },
    lines: [
      { kind: "book", text: "euclid begins with definitions postulates common notions and the discipline of seeing what must be true" },
      { kind: "spec", text: "book I proposition 1: on a finite straight line construct an equilateral triangle" },
      { kind: "ref", text: "diagram one: order is drawn before it is explained" },
      { kind: "code", text: "construct(triangle).bisect(angle).repeat until proof becomes image" },
      { kind: "code", text: "circleA = circle(center:A, radius:distance(A,B)); circleB = circle(B, AB)" },
      { kind: "book", text: "the page teaches by making thought visible as geometry" },
      { kind: "diff add", text: "+ make believe is an old technology for moving an idea into the world" },
      { kind: "terminal", text: "$ draw --compass --straightedge --constraint --wonder" },
      { kind: "ref", text: "the proof is not decoration; it is a user interface for certainty" },
      { kind: "spec", text: "point line circle angle parallel surface axiom proof" },
    ],
  },
  {
    diagram: "pythagoras",
    layout: "proof",
    mark: "underline",
    phrase: { label: "measure imagination", words: ["measure", "imagination"] },
    lines: [
      { kind: "book", text: "pythagoras gives distance a memorable form: a^2 plus b^2 equals c^2" },
      { kind: "ref", text: "ratio becomes music; measure becomes architecture; number becomes imagination" },
      { kind: "spec", text: "right angle hypotenuse square proof proportion harmony" },
      { kind: "diff remove", text: "- intuition without a ruler" },
      { kind: "diff add", text: "+ intuition with a visible structure" },
      { kind: "code", text: "const diagonal = sqrt(width * width + height * height)" },
      { kind: "code", text: "normalize(v){ return v / sqrt(dot(v,v)) }" },
      { kind: "terminal", text: "$ solve frame --grid --lens --distance --scale" },
      { kind: "book", text: "classical proportion is the ancestor of composition layout rigging and spatial trust" },
      { kind: "ref", text: "a square on a side becomes a way to reason about the unseen diagonal" },
    ],
  },
  {
    diagram: "calculus",
    layout: "formula",
    mark: "connect",
    phrase: { label: "motion becomes language", words: ["motion", "language"] },
    lines: [
      { kind: "book", text: "calculus studies change by slicing motion into limits derivatives and integrals" },
      { kind: "spec", text: "d/dx position gives velocity; integral velocity gives distance" },
      { kind: "ref", text: "curves become commands and motion becomes language" },
      { kind: "code", text: "next = current + velocity * deltaTime" },
      { kind: "code", text: "velocity = (position[t] - position[t-1]) / deltaTime" },
      { kind: "code", text: "area += sample(curve, x) * dx" },
      { kind: "diff add", text: "+ a live image is only convincing when time behaves" },
      { kind: "terminal", text: "$ sample motion --frame 24 --substep 8 --error small" },
      { kind: "book", text: "a derivative is a close look at what the system is about to do" },
      { kind: "ref", text: "integration is accumulation with memory; animation is calculus made visible" },
      { kind: "spec", text: "limit tangent slope area continuity velocity acceleration" },
    ],
  },
  {
    diagram: "light",
    layout: "lab",
    mark: "circle",
    phrase: { label: "write with light", words: ["write", "light"] },
    lines: [
      { kind: "book", text: "optics turns a ray into a rule for vision reflection refraction shadow and lens" },
      { kind: "ref", text: "camera obscura: the outside world writes itself inside a dark room with light" },
      { kind: "spec", text: "aperture focal length exposure latitude sensor response color temperature" },
      { kind: "code", text: "radiance = material * light * visibility" },
      { kind: "code", text: "refractDir = refract(ray.direction, normal, eta)" },
      { kind: "code", text: "exposure = pow(2, ev) * shutter * apertureArea" },
      { kind: "diff add", text: "+ write the scene with light before asking pixels to explain it" },
      { kind: "terminal", text: "$ meter --key --fill --edge --practical --screen" },
      { kind: "book", text: "cinema is optical science taught to dream in sequence" },
      { kind: "ref", text: "newton separates white light through a prism and turns color into experiment" },
      { kind: "spec", text: "ray spectrum incidence reflection refraction dispersion image plane" },
    ],
  },
  {
    diagram: "perspective",
    layout: "margin",
    mark: "underline",
    phrase: { label: "picture plane", words: ["picture", "plane"] },
    lines: [
      { kind: "book", text: "perspective turns space into a picture plane with vanishing points and ruled convergence" },
      { kind: "ref", text: "alberti treats the frame as a window; the camera inherits the contract" },
      { kind: "spec", text: "eye point horizon orthogonal transversal projection plane" },
      { kind: "code", text: "screen = project(world * view * lens)" },
      { kind: "code", text: "clip = projection * view * model * vec4(position, 1)" },
      { kind: "diff add", text: "+ picture plane means the world can be staged for one exact observer" },
      { kind: "terminal", text: "$ align frustum --horizon --vanishing-point --lens" },
      { kind: "book", text: "virtual production is perspective theory with a live renderer behind the wall" },
      { kind: "ref", text: "the illusion holds when geometry optics and viewer position agree" },
    ],
  },
  {
    diagram: "computation",
    layout: "terminal",
    mark: "highlight",
    phrase: { label: "hello world", words: ["hello", "world"] },
    lines: [
      { kind: "book", text: "turing asks what a machine can do when symbols rules memory and time are enough" },
      { kind: "ref", text: "shannon measures information and makes uncertainty available for engineering" },
      { kind: "code", text: "print hello world" },
      { kind: "code", text: "machine[state][symbol] = { write, move, nextState }" },
      { kind: "code", text: "bits = ceil(-log2(probability))" },
      { kind: "terminal", text: "$ boot imagination --logic --memory --feedback" },
      { kind: "spec", text: "state transition tape channel entropy noise correction" },
      { kind: "diff add", text: "+ hello world is a tiny spell for entering a computational world" },
      { kind: "book", text: "intelligence first appears as a procedure that can be repeated" },
      { kind: "ref", text: "a universal machine makes every formal process into something one machine can imitate" },
      { kind: "spec", text: "symbol rule memory instruction address table universal machine" },
    ],
  },
  {
    diagram: "network",
    layout: "network",
    mark: "connect",
    phrase: { label: "human machine symbiosis", words: ["human", "machine", "symbiosis"] },
    lines: [
      { kind: "book", text: "licklider imagines human machine symbiosis as a partnership for thinking faster than either alone" },
      { kind: "ref", text: "the useful computer becomes less calculator and more collaborator workspace library and instrument" },
      { kind: "spec", text: "time sharing memory organization graphical input interactive display networked knowledge" },
      { kind: "code", text: "while humanJudges machineSearches and machineSuggests humanDirects" },
      { kind: "code", text: "ui.onInput = event => model.update(event).render()" },
      { kind: "diff remove", text: "- batch processing as a wall between question and answer" },
      { kind: "diff add", text: "+ interactive computing as a live conversation with the problem" },
      { kind: "terminal", text: "$ connect thinking-center --artist --engineer --archive --tool" },
      { kind: "book", text: "the interface becomes the place where imagination negotiates with computation" },
    ],
  },
  {
    diagram: "graphics",
    layout: "render",
    mark: "circle",
    phrase: { label: "real-time cinematic systems", words: ["realtime", "cinematic", "systems"] },
    lines: [
      { kind: "book", text: "computer graphics turns geometry light material camera and time into a synthetic image" },
      { kind: "ref", text: "the rendering equation formalizes light transport as emitted light plus reflected incoming radiance" },
      { kind: "code", text: "for each frame update camera simulate scene shade pixels present realtime" },
      { kind: "code", text: "Lo = Le + integrateHemisphere(brdf * Li * cosTheta)" },
      { kind: "code", text: "color = toneMap(aces(pathTrace(ray, samples)))" },
      { kind: "spec", text: "raster ray path brdf texture normal depth color transform" },
      { kind: "diff add", text: "+ cinematic systems become realtime when feedback is faster than doubt" },
      { kind: "terminal", text: "$ profile renderer --gpu --latency --vblank --budget 16ms" },
      { kind: "book", text: "the believable image is a treaty between physics and performance" },
      { kind: "ref", text: "distributed ray tracing makes soft shadows motion blur and depth of field into sampled dimensions" },
      { kind: "spec", text: "visibility radiance reflectance sampling variance denoise display transform" },
    ],
  },
  {
    diagram: "lightfield",
    layout: "atlas",
    mark: "connect",
    phrase: { label: "sample the possible", words: ["sample", "possible"] },
    lines: [
      { kind: "book", text: "light field rendering treats photographs as slices through a four dimensional flow of light" },
      { kind: "ref", text: "view synthesis becomes less about rebuilding geometry and more about resampling possible rays" },
      { kind: "spec", text: "plenoptic function uv st aperture baseline interpolation compression" },
      { kind: "code", text: "view = resample(lightField, cameraPosition, rayDirection)" },
      { kind: "code", text: "rgb = neuralField(position, direction).integrateAlong(ray)" },
      { kind: "diff add", text: "+ sample the possible before the viewer asks to stand there" },
      { kind: "terminal", text: "$ capture array --baseline --view-grid --novel-view" },
      { kind: "book", text: "the camera array is a memory palace for light" },
      { kind: "ref", text: "neural radiance fields later compress scene appearance into a continuous learned volume" },
    ],
  },
  {
    diagram: "interface",
    layout: "manual",
    mark: "underline",
    phrase: { label: "interactive illustrations", words: ["interactive", "illustrations"] },
    lines: [
      { kind: "book", text: "a diagram becomes an instrument when the hand can test the idea" },
      { kind: "ref", text: "interactive illustrations teach by letting relationships move instead of merely sit" },
      { kind: "code", text: "onPointerMove update model then redraw explanation" },
      { kind: "code", text: "state = reducer(state, gesture); draw(diagram(state))" },
      { kind: "spec", text: "input affordance feedback continuity reversibility delight" },
      { kind: "diff remove", text: "- static explanation that asks the viewer to imagine motion" },
      { kind: "diff add", text: "+ live explanation that lets motion answer" },
      { kind: "terminal", text: "$ bind gesture --drag --gyro --wasd --spacebar" },
      { kind: "book", text: "the best interface feels like a diagram that has learned to listen" },
      { kind: "ref", text: "an explanation gains credibility when the observer can disturb it and it remains coherent" },
    ],
  },
  {
    diagram: "stage",
    layout: "cue",
    mark: "highlight",
    phrase: { label: "use technology to tell tales", words: ["use", "technology", "tell", "tales"] },
    lines: [
      { kind: "book", text: "stagecraft has always used technology to tell tales: rope mirror lens lamp screen sensor" },
      { kind: "ref", text: "the trick is not the machine but the moment when the audience stops seeing the machine" },
      { kind: "spec", text: "cue timing illusion sightline choreography control narrative" },
      { kind: "code", text: "if audienceBelieves then hideTechnology else simplify" },
      { kind: "code", text: "cue.fire(timecode).then(light).then(media).then(camera)" },
      { kind: "diff add", text: "+ use technology to tell tales without making the technology the tale" },
      { kind: "terminal", text: "$ cue scene --light --camera --sound --display --performer" },
      { kind: "book", text: "make believe becomes a production system when timing is shared" },
      { kind: "ref", text: "pepper mirror back projection motion control and led volumes are one lineage of engineered illusion" },
      { kind: "spec", text: "apparatus rehearsal cue operator performer audience belief" },
    ],
  },
  {
    diagram: "volume",
    layout: "schematic",
    mark: "connect",
    phrase: { label: "virtual production engineer", words: ["virtual", "production", "engineer"] },
    lines: [
      { kind: "book", text: "virtual production joins camera tracking realtime rendering LED display and practical light" },
      { kind: "ref", text: "the engineer builds the invisible agreement between lens stage renderer and crew" },
      { kind: "spec", text: "frustum genlock color pipeline ndisplay mesh calibration media server" },
      { kind: "code", text: "sync(camera, volume, renderer, color, timecode)" },
      { kind: "code", text: "wallFrustum = trackedCamera.toFrustum(lens, ledWall)" },
      { kind: "code", text: "delta = displayTime - cameraTime; assert(abs(delta) < frame)" },
      { kind: "diff add", text: "+ production becomes virtual when the world can answer back on set" },
      { kind: "terminal", text: "$ calibrate volume --tracking --frustum --sync --take ready" },
      { kind: "book", text: "a good system disappears into the director's confidence" },
      { kind: "ref", text: "the volume is part camera department part stage department part render farm part instrument" },
      { kind: "spec", text: "latency lens metadata mocap color management wall processor operator workflow" },
    ],
  },
  {
    diagram: "prototype",
    layout: "diff",
    mark: "underline",
    phrase: { label: "creative technologist", words: ["creative", "technologist"] },
    lines: [
      { kind: "book", text: "a creative technologist translates desire into prototype and prototype into shared language" },
      { kind: "ref", text: "the work sits between art direction engineering research and production reality" },
      { kind: "spec", text: "prototype evaluate refine integrate document handoff" },
      { kind: "code", text: "while unknownsRemain build smaller experiment" },
      { kind: "code", text: "risk.sort(byImpact).slice(0,3).map(buildTest)" },
      { kind: "diff remove", text: "- wait until the concept is safe enough to test" },
      { kind: "diff add", text: "+ test until the concept becomes safe enough to make" },
      { kind: "terminal", text: "$ ship prototype --useful --legible --crew-safe --story-first" },
      { kind: "book", text: "the prototype is research with handles; it lets a team argue with evidence" },
      { kind: "ref", text: "creative technology is credible when invention survives handoff to production" },
    ],
  },
  {
    diagram: "neural",
    layout: "matrix",
    mark: "circle",
    phrase: { label: "learn representations", words: ["learn", "representations"] },
    lines: [
      { kind: "book", text: "back propagation adjusts internal weights until hidden units learn representations of the task" },
      { kind: "ref", text: "the model does not receive a drawing of the feature; it discovers useful structure through error" },
      { kind: "spec", text: "input hidden output loss gradient descent weight update generalization" },
      { kind: "code", text: "loss.backward(); optimizer.step(); repeat until representation holds" },
      { kind: "code", text: "hidden = activation(weights * input + bias)" },
      { kind: "code", text: "gradient = transpose(input) * error" },
      { kind: "diff remove", text: "- hand write every rule for perception" },
      { kind: "diff add", text: "+ learn representations from examples and correction" },
      { kind: "terminal", text: "$ train network --features latent --errors visible --patience" },
      { kind: "book", text: "intelligence becomes a surface shaped by data feedback and objective" },
    ],
  },
  {
    diagram: "ai",
    layout: "attention",
    mark: "connect",
    phrase: { label: "attention becomes interface", words: ["attention", "interface"] },
    lines: [
      { kind: "book", text: "transformers make attention the primary operation for relating tokens across context" },
      { kind: "ref", text: "attention becomes interface when a model can point its computation at the right part of the prompt" },
      { kind: "spec", text: "tokens embeddings positional encoding self attention feed forward layers context window" },
      { kind: "code", text: "context attends to question; answer attends to evidence; tool attends to intent" },
      { kind: "code", text: "scores = softmax((Q @ K.T) / sqrt(d_model))" },
      { kind: "code", text: "answer = model.generate(prompt + retrievedContext + toolResults)" },
      { kind: "diff remove", text: "- automate the artist out of the process" },
      { kind: "diff add", text: "+ extend attention across context memory action and taste" },
      { kind: "terminal", text: "$ ask model --with-context --with-tools --keep-human-in-loop" },
      { kind: "book", text: "large language models make text feel less like storage and more like an operating surface" },
      { kind: "ref", text: "agentic systems plan search call tools observe and revise under human direction" },
    ],
  },
  {
    diagram: "story",
    layout: "poem",
    mark: "highlight",
    phrase: { label: "tools for impossible shots", words: ["tools", "impossible", "shots"] },
    lines: [
      { kind: "book", text: "the sequence of intelligence is not a ladder but a set of tools for impossible shots" },
      { kind: "ref", text: "geometry measures the world optics catches it computation simulates it AI negotiates it" },
      { kind: "spec", text: "story first system second interface third spectacle last" },
      { kind: "code", text: "return makeBelieve.with(light, math, code, crew, model)" },
      { kind: "code", text: "shot = story.need().solveWith(geometry, optics, compute, ai)" },
      { kind: "diff add", text: "+ order hides inside chaos when every reference points back to story" },
      { kind: "terminal", text: "$ render tale --human --machine --camera --wonder" },
      { kind: "book", text: "use technology to tell tales and let the tale decide which technology survives" },
    ],
  },
];

const BLACKOUT_MICRO_LINES = [
  { kind: "spec", text: "lemma observation construction proof apparatus calibration inference" },
  { kind: "ref", text: "notes in the margin become instructions when the system is live" },
  { kind: "code", text: "const belief = image + timing + context + trust" },
  { kind: "terminal", text: "$ compare reference --paper --stage --model --take" },
  { kind: "book", text: "every technical diagram is also a promise about what can be controlled" },
  { kind: "spec", text: "angle signal sample transform display feedback memory" },
  { kind: "diff add", text: "+ make the hidden structure visible enough to use" },
  { kind: "ref", text: "a tool earns attention when it changes what the crew can attempt" },
  { kind: "code", text: "observe(); model(); render(); revise();" },
  { kind: "terminal", text: "$ trace path --from theorem --through lens --to story" },
  { kind: "book", text: "the intelligent page contains both disorder and a route through disorder" },
  { kind: "spec", text: "coordinate frame pipeline operator objective constraint" },
  { kind: "diff remove", text: "- spectacle without system" },
  { kind: "diff add", text: "+ wonder with engineering behind it" },
  { kind: "ref", text: "the best reference material rewards a second and third look" },
  { kind: "code", text: "story = technology.filter(meaningful).compose()" },
  { kind: "terminal", text: "$ annotate chaos --find-order --keep-motion" },
  { kind: "book", text: "progress looks accidental until the lineage is drawn" },
  { kind: "code", text: "function project(p){ return [f*p.x/p.z, f*p.y/p.z] }" },
  { kind: "code", text: "dx = (f(x + h) - f(x - h)) / (2 * h)" },
  { kind: "code", text: "radiance += brdf * incoming * max(0, dot(n,l))" },
  { kind: "code", text: "entropy = -sum(p.map(x => x * log2(x)))" },
  { kind: "code", text: "attention = softmax((Q * K.T) / sqrt(d)) * V" },
  { kind: "code", text: "weights -= learningRate * gradient(loss, weights)" },
  { kind: "code", text: "frustum = lensProjection(focalLength, sensor, trackerPose)" },
  { kind: "code", text: "if latency > frameBudget then reduceQuality() else preserveIntent()" },
  { kind: "code", text: "agent.observe(context).plan(goal).act(tools).revise()" },
  { kind: "terminal", text: "$ ffmpeg -i plate.mov -vf colorspace,scale,format output.exr" },
  { kind: "terminal", text: "$ python render.py --samples 64 --denoise --aces --slate" },
  { kind: "spec", text: "implementation note: theorem becomes algorithm becomes interface becomes shot" },
];

function getBlackoutMicroLines(pageIndex) {
  return Array.from({ length: 26 }, (_, i) => BLACKOUT_MICRO_LINES[(pageIndex * 3 + i) % BLACKOUT_MICRO_LINES.length]);
}

function fallbackLayoutBlackoutText(tokens) {
  const rows = [];
  const maxChars = 72;
  let row = [];
  let count = 0;
  tokens.forEach((token) => {
    if (row.length && count + token.word.length + 1 > maxChars) {
      rows.push({ tokens: row, kind: row[0]?.kind || "book", column: rows.length % 4 });
      row = [];
      count = 0;
    }
    row.push(token);
    count += token.word.length + 1;
  });
  if (row.length) rows.push({ tokens: row, kind: row[0]?.kind || "book", column: rows.length % 4 });
  return rows;
}

function layoutBlackoutText(lines, pretext) {
  const tokens = lines.flatMap((line, lineIndex) => (
    line.text.split(" ").filter(Boolean).map((word, wordIndex) => ({
      word,
      kind: line.kind,
      lineIndex,
      wordIndex,
    }))
  ));
  if (!pretext) return fallbackLayoutBlackoutText(tokens);

  const columnCount = 4;
  const columnWidth = 245;
  const font = '13px "IBM Plex Mono", "IBM Plex Sans", sans-serif';
  const prepared = pretext.prepareWithSegments(tokens.map((token) => token.word).join(" "), font);
  const { lines: pretextLines } = pretext.layoutWithLines(prepared, columnWidth, 20);
  let tokenIndex = 0;
  return pretextLines.map((line, rowIndex) => {
    const words = line.text.trim().split(/\s+/).filter(Boolean);
    const rowTokens = tokens.slice(tokenIndex, tokenIndex + words.length);
    tokenIndex += rowTokens.length;
    return { tokens: rowTokens, kind: rowTokens[0]?.kind || "book", column: rowIndex % columnCount };
  }).filter((row) => row.tokens.length);
}

function DiagramText({ x, y, children, className = "" }) {
  return <text className={`diagram-text ${className}`} x={x} y={y}>{children}</text>;
}

function PlateLabel({ x, y, children }) {
  return <text className="diagram-label" x={x} y={y}>{children}</text>;
}

function GeometryPlate({ variant = "euclid" }) {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="58" y="54" width="236" height="236" />
      <rect className="diagram-plane diagram-plane--blue" x="700" y="92" width="198" height="256" />
      <path className="diagram-line diagram-line--axis" d="M78 348 H930 M112 378 V52" />
      <path className="diagram-line diagram-line--soft" d="M126 318 L326 84 L526 318 Z M126 318 H526 M326 84 V318" />
      <circle className="diagram-circle" cx="126" cy="318" r="200" />
      <circle className="diagram-circle" cx="526" cy="318" r="200" />
      <path className="diagram-line" d="M652 304 L652 118 L884 304 Z M652 304 H884 M652 118 L884 304" />
      <path className="diagram-line diagram-line--thin" d="M686 270 L686 304 L652 304 M120 318 C212 180 430 180 526 318" />
      <DiagramText x="114" y="346">A</DiagramText><DiagramText x="318" y="66">C</DiagramText><DiagramText x="520" y="346">B</DiagramText>
      <DiagramText x="704" y="124">{variant === "pythagoras" ? "a² + b² = c²" : "AB = AC = BC"}</DiagramText>
      <DiagramText x="704" y="164">{variant === "calculus" ? "dy/dx = lim Δy/Δx" : "construct / measure / prove"}</DiagramText>
      <PlateLabel x="108" y="42">GEOMETRY PLATE / CARTESIAN CONSTRUCTION</PlateLabel>
    </>
  );
}

function OpticsPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--red" x="54" y="86" width="184" height="248" />
      <rect className="diagram-plane diagram-plane--yellow" x="664" y="54" width="246" height="310" />
      <path className="diagram-line diagram-line--axis" d="M70 210 H930 M392 70 V350" />
      <path className="diagram-line diagram-line--soft" d="M76 210 L392 144 L392 276 Z" />
      <path className="diagram-prism" d="M392 144 L392 276 L522 210 Z" />
      <path className="diagram-line" d="M522 210 L850 82 M522 210 L888 150 M522 210 L902 212 M522 210 L888 274 M522 210 L850 342" />
      <path className="diagram-line diagram-line--thin" d="M320 126 C350 168 350 252 320 294 M610 78 V342 M660 78 V342 M710 78 V342 M760 78 V342" />
      <DiagramText x="82" y="190">incident ray</DiagramText><DiagramText x="330" y="112">θ₁</DiagramText><DiagramText x="532" y="178">θ₂</DiagramText>
      <DiagramText x="598" y="52">n₁ sin θ₁ = n₂ sin θ₂</DiagramText><DiagramText x="638" y="378">sensor / spectrum / λ</DiagramText>
      <PlateLabel x="90" y="52">OPTICS PLATE / LIGHT TRANSPORT</PlateLabel>
    </>
  );
}

function ComputationPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--blue" x="58" y="70" width="842" height="70" />
      <rect className="diagram-plane diagram-plane--yellow" x="118" y="250" width="232" height="86" />
      <path className="diagram-line diagram-line--soft" d="M84 104 H884 M84 104 v70 M184 104 v70 M284 104 v70 M384 104 v70 M484 104 v70 M584 104 v70 M684 104 v70 M784 104 v70 M884 104 v70 M84 174 H884" />
      <path className="diagram-line" d="M170 292 C268 188 390 188 488 292 S708 396 820 226" />
      <path className="diagram-line diagram-line--thin" d="M218 292 L336 198 L488 292 L650 252 L820 226" />
      <circle className="diagram-node" cx="218" cy="292" r="22" /><circle className="diagram-node" cx="488" cy="292" r="22" /><circle className="diagram-node" cx="820" cy="226" r="22" />
      <DiagramText x="102" y="94">tape</DiagramText><DiagramText x="188" y="154">1</DiagramText><DiagramText x="288" y="154">0</DiagramText><DiagramText x="388" y="154">□</DiagramText>
      <DiagramText x="116" y="226">machine[state][symbol] → write, move, next</DiagramText><DiagramText x="550" y="334">H(X) = -Σ p log₂ p</DiagramText>
      <PlateLabel x="84" y="48">COMPUTATION PLATE / TURING + SHANNON</PlateLabel>
    </>
  );
}

function GraphicsPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="584" y="54" width="320" height="286" />
      <rect className="diagram-plane diagram-plane--red" x="82" y="252" width="192" height="86" />
      <path className="diagram-line diagram-line--soft" d="M98 252 L488 118 L884 320 M98 252 L488 318 L884 320 M98 252 L488 118 M488 118 L488 318" />
      <path className="diagram-line" d="M488 118 L700 82 L884 320 L488 318 Z M594 164 L758 118 M594 230 L820 210 M594 292 L884 320" />
      <path className="diagram-line diagram-line--thin" d="M98 252 L704 204 M98 252 L760 120 M98 252 L820 286" />
      <circle className="diagram-dot" cx="98" cy="252" r="8" />
      <DiagramText x="70" y="236">camera</DiagramText><DiagramText x="512" y="104">frustum</DiagramText><DiagramText x="692" y="72">LED / volume</DiagramText>
      <DiagramText x="470" y="372">Lo = Le + ∫Ω fr Li cosθ dω</DiagramText><DiagramText x="130" y="348">sync: lens + tracking + genlock + color</DiagramText>
      <PlateLabel x="88" y="48">GRAPHICS / VIRTUAL PRODUCTION PLATE</PlateLabel>
    </>
  );
}

function NeuralPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--blue" x="52" y="58" width="250" height="300" />
      <rect className="diagram-plane diagram-plane--red" x="704" y="76" width="214" height="266" />
      <path className="diagram-line diagram-line--thin" d="M156 112 L382 92 L614 132 L842 104 M156 204 L382 194 L614 212 L842 204 M156 296 L382 294 L614 292 L842 304 M156 112 L382 194 L614 292 M156 296 L382 194 L614 132 M382 92 L614 212 L842 304 M382 294 L614 212 L842 104" />
      {[156, 382, 614, 842].map((x, col) => [112, 204, 296].map((y, row) => (
        <circle className="diagram-node" key={`${col}-${row}`} cx={x} cy={y + (col % 2 ? -20 : 0)} r={18} />
      )))}
      <path className="diagram-line diagram-line--soft" d="M146 370 H854 M146 370 L382 344 L614 362 L854 332" />
      <DiagramText x="120" y="72">input</DiagramText><DiagramText x="328" y="52">hidden</DiagramText><DiagramText x="570" y="88">attention</DiagramText><DiagramText x="790" y="72">output</DiagramText>
      <DiagramText x="320" y="388">softmax(QKᵀ / √d)V</DiagramText><DiagramText x="518" y="32">∂loss / ∂w</DiagramText>
      <PlateLabel x="90" y="34">NEURAL / ATTENTION PLATE</PlateLabel>
    </>
  );
}

function SystemsPlate() {
  return (
    <>
      <rect className="diagram-plane diagram-plane--yellow" x="70" y="68" width="194" height="94" />
      <rect className="diagram-plane diagram-plane--blue" x="390" y="164" width="220" height="102" />
      <rect className="diagram-plane diagram-plane--red" x="720" y="258" width="188" height="94" />
      <path className="diagram-line diagram-line--soft" d="M166 162 C270 62 392 92 498 164 S702 342 814 258" />
      <path className="diagram-line" d="M166 162 L500 216 L814 258 M166 162 L500 216 M500 216 L814 258" />
      <path className="diagram-line diagram-line--thin" d="M100 116 H236 M424 214 H578 M748 306 H880 M500 70 V372" />
      <DiagramText x="102" y="116">idea</DiagramText><DiagramText x="426" y="214">prototype</DiagramText><DiagramText x="748" y="306">shot</DiagramText>
      <DiagramText x="300" y="350">story.need().solveWith(math, light, code, crew, model)</DiagramText>
      <PlateLabel x="94" y="42">SYSTEMS / STORY PLATE</PlateLabel>
    </>
  );
}

function BlackoutDiagram({ type }) {
  const archetypes = {
    euclid: <GeometryPlate variant="euclid" />,
    light: <OpticsPlate />,
    computation: <ComputationPlate />,
    graphics: <GraphicsPlate />,
    neural: <NeuralPlate />,
    story: <SystemsPlate />,
  };
  if (archetypes[type]) {
    return (
      <svg className={`blackout-panel__diagram blackout-panel__diagram--${type}`} viewBox="0 0 1000 420" aria-hidden="true">
        {archetypes[type]}
      </svg>
    );
  }

  const diagrams = {
    euclid: (
      <>
        <path className="diagram-line diagram-line--soft" d="M130 318 L305 92 L480 318 Z M130 318 L480 318 M305 92 L305 318" />
        <path className="diagram-line diagram-line--thin" d="M130 318 C164 122 446 122 480 318 M130 318 C184 470 426 470 480 318" />
        <circle className="diagram-circle" cx="130" cy="318" r="176" />
        <circle className="diagram-circle" cx="480" cy="318" r="176" />
        <DiagramText x="118" y="346">A</DiagramText><DiagramText x="300" y="78">C</DiagramText><DiagramText x="470" y="346">B</DiagramText>
        <DiagramText x="590" y="132">I.1 construct equilateral triangle</DiagramText>
        <DiagramText x="590" y="168">AB = AC = BC</DiagramText>
        <DiagramText x="590" y="204">r(A) = r(B)</DiagramText>
      </>
    ),
    pythagoras: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="86" y="92" width="236" height="236" />
        <rect className="diagram-plane diagram-plane--red" x="562" y="76" width="276" height="118" />
        <path className="diagram-line diagram-line--soft" d="M140 316 L140 116 L440 316 Z" />
        <path className="diagram-line" d="M140 316 L140 116 L-60 116 L-60 316 Z M140 316 L440 316 L440 616 L140 616 Z M140 116 L440 316 L640 16 L340 -184 Z" />
        <path className="diagram-line diagram-line--thin" d="M168 288 L168 316 L140 316" />
        <DiagramText x="188" y="218">a</DiagramText><DiagramText x="290" y="346">b</DiagramText><DiagramText x="306" y="204">c</DiagramText>
        <DiagramText x="610" y="122">a^2 + b^2 = c^2</DiagramText>
        <DiagramText x="610" y="158">right angle / invariant distance</DiagramText>
      </>
    ),
    calculus: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="78" y="116" width="842" height="208" />
        <rect className="diagram-plane diagram-plane--yellow" x="594" y="62" width="276" height="94" />
        <path className="diagram-line diagram-line--soft" d="M80 322 C180 322 192 118 294 118 C402 118 390 322 510 322 C625 322 642 140 760 120 C850 105 902 178 940 250" />
        <path className="diagram-line diagram-line--thin" d="M76 342 L930 342 M114 368 L114 84 M256 342 L256 124 M420 342 L420 238 M604 342 L604 300 M784 342 L784 134" />
        <path className="diagram-line" d="M250 132 L440 248 M600 300 L792 132" />
        <DiagramText x="128" y="96">y</DiagramText><DiagramText x="910" y="360">x</DiagramText>
        <DiagramText x="610" y="96">dy/dx = velocity</DiagramText>
        <DiagramText x="610" y="132">∫ v dt = distance</DiagramText>
      </>
    ),
    light: (
      <>
        <path className="diagram-line diagram-line--soft" d="M80 210 L402 160 L402 260 Z" />
        <path className="diagram-line" d="M402 160 L682 72 M402 184 L704 146 M402 210 L716 216 M402 236 L704 286 M402 260 L682 352" />
        <path className="diagram-line diagram-line--thin" d="M80 210 L402 210 M402 84 L402 336" />
        <path className="diagram-prism" d="M402 160 L402 260 L492 210 Z" />
        <DiagramText x="96" y="194">white light</DiagramText>
        <DiagramText x="560" y="64">λ red</DiagramText><DiagramText x="732" y="220">spectrum</DiagramText><DiagramText x="558" y="366">λ violet</DiagramText>
        <DiagramText x="360" y="128">n1 sin θ1 = n2 sin θ2</DiagramText>
      </>
    ),
    perspective: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="112" y="104" width="260" height="228" />
        <rect className="diagram-plane diagram-plane--blue" x="628" y="104" width="260" height="228" />
        <path className="diagram-line diagram-line--soft" d="M500 204 L86 78 M500 204 L918 78 M500 204 L82 352 M500 204 L920 352" />
        <path className="diagram-line" d="M146 116 L372 166 L372 286 L146 336 Z M628 166 L852 116 L852 336 L628 286 Z" />
        <path className="diagram-line diagram-line--thin" d="M70 204 L930 204 M500 58 L500 366" />
        <circle className="diagram-dot" cx="500" cy="204" r="5" />
        <DiagramText x="516" y="196">VP</DiagramText><DiagramText x="74" y="196">horizon</DiagramText>
        <DiagramText x="624" y="84">picture plane</DiagramText>
        <DiagramText x="346" y="356">x' = f x / z</DiagramText>
      </>
    ),
    computation: (
      <>
        <path className="diagram-line diagram-line--soft" d="M100 128 L900 128 M100 204 L900 204 M100 280 L900 280" />
        <path className="diagram-line" d="M128 104 h92 v48 h-92 Z M306 180 h92 v48 h-92 Z M484 256 h92 v48 h-92 Z M662 104 h92 v48 h-92 Z" />
        <path className="diagram-line diagram-line--thin" d="M220 128 L306 204 L398 204 L484 280 L576 280 L662 128" />
        <DiagramText x="118" y="94">state q0</DiagramText><DiagramText x="296" y="170">read/write</DiagramText>
        <DiagramText x="474" y="246">transition</DiagramText><DiagramText x="650" y="94">halt?</DiagramText>
        <DiagramText x="118" y="334">tape: 0 1 1 □ 0 1</DiagramText>
      </>
    ),
    network: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="128" y="82" width="230" height="236" />
        <rect className="diagram-plane diagram-plane--yellow" x="628" y="102" width="250" height="232" />
        <path className="diagram-line diagram-line--thin" d="M182 130 L358 90 L514 190 L690 108 L846 252 M182 130 L306 286 L514 190 L704 316 L846 252 M358 90 L704 316" />
        <circle className="diagram-node" cx="182" cy="130" r="28" />
        <circle className="diagram-node" cx="358" cy="90" r="20" />
        <circle className="diagram-node" cx="514" cy="190" r="34" />
        <circle className="diagram-node" cx="704" cy="316" r="24" />
        <circle className="diagram-node" cx="846" cy="252" r="30" />
        <circle className="diagram-node" cx="306" cy="286" r="18" />
        <DiagramText x="126" y="92">human</DiagramText><DiagramText x="474" y="178">symbiosis</DiagramText><DiagramText x="804" y="216">machine</DiagramText>
        <DiagramText x="330" y="370">interactive loop: ask / compute / judge / revise</DiagramText>
      </>
    ),
    graphics: (
      <>
        <path className="diagram-line diagram-line--soft" d="M120 320 L280 110 L520 150 L660 330 Z M280 110 L660 330 M520 150 L120 320" />
        <path className="diagram-line" d="M660 330 L900 210 M120 320 L900 210 M280 110 L900 210 M520 150 L900 210" />
        <circle className="diagram-circle" cx="900" cy="210" r="42" />
        <DiagramText x="690" y="194">camera</DiagramText><DiagramText x="118" y="348">mesh</DiagramText>
        <DiagramText x="570" y="92">Lo = Le + ∫ fr Li cosθ dω</DiagramText>
        <DiagramText x="570" y="128">BRDF / visibility / sample</DiagramText>
      </>
    ),
    lightfield: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="118" y="92" width="782" height="70" />
        <rect className="diagram-plane diagram-plane--red" x="118" y="260" width="782" height="70" />
        <path className="diagram-line diagram-line--thin" d="M120 120 C260 96 370 96 510 120 S760 144 900 120 M120 300 C260 276 370 276 510 300 S760 324 900 300" />
        <path className="diagram-line diagram-line--soft" d="M160 102 L160 318 M262 102 L262 318 M364 102 L364 318 M466 102 L466 318 M568 102 L568 318 M670 102 L670 318 M772 102 L772 318 M874 102 L874 318" />
        <path className="diagram-line" d="M160 120 L874 300 M160 300 L874 120 M262 120 L772 300 M262 300 L772 120" />
        <DiagramText x="150" y="92">u</DiagramText><DiagramText x="872" y="92">v</DiagramText><DiagramText x="132" y="338">s</DiagramText><DiagramText x="884" y="338">t</DiagramText>
        <DiagramText x="392" y="210">L(u,v,s,t)</DiagramText>
      </>
    ),
    interface: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="118" y="110" width="312" height="194" />
        <rect className="diagram-plane diagram-plane--blue" x="570" y="92" width="310" height="232" />
        <path className="diagram-line diagram-line--soft" d="M120 112 h310 v190 h-310 Z M570 92 h310 v232 h-310 Z" />
        <path className="diagram-line" d="M168 162 h210 M168 206 h152 M168 250 h238 M620 152 C700 96 802 122 826 204 C848 280 738 330 650 286" />
        <path className="diagram-line diagram-line--thin" d="M430 206 L570 206 M500 178 L570 152 M500 234 L570 286" />
        <DiagramText x="146" y="94">control</DiagramText><DiagramText x="604" y="78">response</DiagramText>
        <DiagramText x="452" y="198">feedback</DiagramText>
      </>
    ),
    stage: (
      <>
        <rect className="diagram-plane diagram-plane--red" x="120" y="238" width="760" height="102" />
        <rect className="diagram-plane diagram-plane--yellow" x="400" y="70" width="200" height="110" />
        <path className="diagram-line diagram-line--soft" d="M120 330 C270 240 410 202 500 202 C590 202 730 240 880 330" />
        <path className="diagram-line" d="M120 330 L500 72 L880 330 M254 240 L746 240 M360 168 L640 168" />
        <path className="diagram-line diagram-line--thin" d="M190 90 L300 240 M810 90 L700 240 M500 72 L500 360" />
        <DiagramText x="468" y="64">fly</DiagramText><DiagramText x="156" y="356">audience</DiagramText><DiagramText x="690" y="228">sightline</DiagramText>
        <DiagramText x="404" y="388">cue = timing + belief</DiagramText>
      </>
    ),
    volume: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="170" y="112" width="500" height="230" />
        <rect className="diagram-plane diagram-plane--yellow" x="670" y="112" width="170" height="248" />
        <path className="diagram-line diagram-line--soft" d="M170 112 h500 v230 h-500 Z M670 112 L840 190 L840 360 L670 342 M840 190 L340 190" />
        <path className="diagram-line" d="M90 250 L340 190 L840 360 M90 250 L670 112 M90 250 L670 342" />
        <circle className="diagram-dot" cx="90" cy="250" r="7" />
        <DiagramText x="72" y="238">lens</DiagramText><DiagramText x="360" y="178">frustum</DiagramText><DiagramText x="704" y="106">LED volume</DiagramText>
        <DiagramText x="440" y="382">genlock / timecode / color</DiagramText>
      </>
    ),
    prototype: (
      <>
        <rect className="diagram-plane diagram-plane--yellow" x="126" y="112" width="238" height="104" />
        <rect className="diagram-plane diagram-plane--blue" x="390" y="156" width="238" height="104" />
        <rect className="diagram-plane diagram-plane--red" x="654" y="200" width="238" height="104" />
        <path className="diagram-line diagram-line--soft" d="M126 112 h238 v104 h-238 Z M390 156 h238 v104 h-238 Z M654 200 h238 v104 h-238 Z" />
        <path className="diagram-line diagram-line--thin" d="M364 164 L390 164 M628 216 L654 216 M246 216 L246 326 L774 326 L774 304" />
        <path className="diagram-line" d="M166 148 h150 M430 194 h150 M694 238 h150" />
        <DiagramText x="158" y="100">prototype</DiagramText><DiagramText x="424" y="144">test</DiagramText><DiagramText x="686" y="188">handoff</DiagramText>
        <DiagramText x="318" y="366">unknown → experiment → evidence → system</DiagramText>
      </>
    ),
    neural: (
      <>
        <path className="diagram-line diagram-line--thin" d="M160 110 L390 90 L620 140 L850 104 M160 210 L390 190 L620 220 L850 204 M160 310 L390 290 L620 300 L850 312 M160 110 L390 190 L620 300 M160 310 L390 190 L620 140 M390 90 L620 220 L850 312 M390 290 L620 220 L850 104" />
        {[160, 390, 620, 850].map((x, col) => [110, 210, 310].map((y, row) => (
          <circle className="diagram-node" key={`${col}-${row}`} cx={x} cy={y + (col % 2 ? -20 : 0)} r={15} />
        )))}
        <DiagramText x="132" y="74">input</DiagramText><DiagramText x="350" y="48">hidden</DiagramText><DiagramText x="596" y="94">latent</DiagramText><DiagramText x="816" y="74">output</DiagramText>
        <DiagramText x="356" y="374">∂loss / ∂w</DiagramText>
      </>
    ),
    ai: (
      <>
        <rect className="diagram-plane diagram-plane--blue" x="130" y="88" width="680" height="44" />
        <rect className="diagram-plane diagram-plane--yellow" x="130" y="208" width="680" height="44" />
        <rect className="diagram-plane diagram-plane--red" x="130" y="268" width="680" height="44" />
        <path className="diagram-line diagram-line--thin" d="M130 110 h740 M130 170 h740 M130 230 h740 M130 290 h740" />
        <path className="diagram-line diagram-line--soft" d="M190 110 L378 230 L566 170 L754 290 M190 290 L378 170 L566 230 L754 110" />
        <path className="diagram-line" d="M170 88 h80 v44 h-80 Z M338 208 h80 v44 h-80 Z M526 148 h80 v44 h-80 Z M714 268 h80 v44 h-80 Z" />
        <DiagramText x="164" y="78">Q</DiagramText><DiagramText x="336" y="198">K</DiagramText><DiagramText x="526" y="138">V</DiagramText><DiagramText x="710" y="258">context</DiagramText>
        <DiagramText x="338" y="354">softmax(QKᵀ / √d)V</DiagramText>
      </>
    ),
    story: (
      <>
        <path className="diagram-line diagram-line--soft" d="M120 300 C230 90 408 360 500 186 C592 18 770 330 880 118" />
        <path className="diagram-line" d="M120 300 L500 186 L880 118 M206 210 C290 250 350 250 428 210 M570 196 C650 150 724 150 800 196" />
        <path className="diagram-line diagram-line--thin" d="M160 340 h680 M500 66 v300" />
        <DiagramText x="118" y="322">geometry</DiagramText><DiagramText x="456" y="178">story</DiagramText><DiagramText x="782" y="106">AI</DiagramText>
        <DiagramText x="356" y="382">tools → shots → tales</DiagramText>
      </>
    ),
  };

  return (
    <svg className={`blackout-panel__diagram blackout-panel__diagram--${type}`} viewBox="0 0 1000 420" aria-hidden="true">
      {diagrams[type] || diagrams.euclid}
    </svg>
  );
}

function BlackoutPoetryPanel() {
  const [active, setActive] = useState(0);
  const [pretext, setPretext] = useState(null);
  const panelRef = useRef(null);
  const activePage = BLACKOUT_PAGES[active];
  const activeStatement = activePage.phrase;
  const markMode = activePage.mark || "highlight";
  const pageLines = useMemo(() => [...activePage.lines, ...getBlackoutMicroLines(active)], [activePage, active]);
  const laidOutRows = useMemo(() => layoutBlackoutText(pageLines, pretext), [pageLines, pretext]);

  const cycle = () => setActive((idx) => (idx + 1) % BLACKOUT_PAGES.length);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = window.setInterval(cycle, 3600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    window.__pretextPromise
      ?.then((mod) => {
        if (!cancelled) setPretext(mod);
      })
      .catch((err) => console.warn('[blackout-pretext]', err));
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      ref={panelRef}
      className="blackout-panel"
      role="button"
      tabIndex="0"
      aria-label={`Identity phrase: ${activeStatement.label}`}
      onMouseEnter={cycle}
      onClick={cycle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cycle();
        }
      }}
    >
      <div key={active} className={`blackout-panel__page blackout-panel__page--${activePage.layout}`}>
        <figure className="blackout-panel__figure" aria-hidden="true">
          <BlackoutDiagram type={activePage.diagram} />
        </figure>
        <div className="blackout-panel__manual-flow" aria-hidden="true">
          {laidOutRows.map((row, rowIndex) => (
            <p
              key={rowIndex}
              className={`blackout-panel__manual-row blackout-panel__manual-row--${(row.kind || "book").replace(' ', '-')} blackout-panel__manual-row--c${row.column || 0}`}
            >
              {row.tokens.map((token) => {
                const clean = token.word.toLowerCase().replace(/[^a-z-]/g, '');
              const isActive = activeStatement.words.includes(clean);
                const isMicro = token.lineIndex >= activePage.lines.length;
                const key = `${token.lineIndex}:${token.wordIndex}:${clean}`;
              return (
                <React.Fragment key={key}>
                  <span
                      className={`blackout-panel__word blackout-panel__word--${token.kind.replace(' ', '-')} ${isMicro ? 'blackout-panel__word--micro' : ''} ${isActive ? `is-active is-active--${markMode}` : ''}`}
                  >
                      {token.word}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  HelpPlayer — embedded MESH-projection 360° video
// ────────────────────────────────────────────────────────────────────

function HelpPlayer({ src }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [projection, setProjection] = useState(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const rendererRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function go() {
      try {
        // HEAD probe first so a missing file fails fast and the
        // placeholder shows immediately instead of stalling.
        const head = await fetch(src, { method: 'HEAD' }).catch(() => null);
        if (!head || !head.ok) { if (!cancelled) setStatus('missing'); return; }
        const mod = await window.__spotlightBundlePromise;
        if (cancelled) return;
        const result = await mod.mountSpotlight(hostRef.current, src);
        if (cancelled) { result.renderer.dispose(); return; }
        rendererRef.current = result.renderer;
        result.renderer.setStateCallback((state) => {
          setMuted(state.muted);
          setPaused(state.paused);
        });
        setProjection(result.projection);
        setStatus('ready');
      } catch (err) {
        console.error('[help-player]', err);
        if (!cancelled) setStatus('error');
      }
    }
    go();
    return () => {
      cancelled = true;
      if (rendererRef.current) { rendererRef.current.dispose(); rendererRef.current = null; }
    };
  }, [src]);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') setShowHint(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hideHint = () => setShowHint(false);
  const resetHint = () => setShowHint(true);

  const togglePlayback = () => {
    if (!rendererRef.current) return;
    if (paused) rendererRef.current.play();
    else rendererRef.current.pause();
  };
  const replayWithSound = () => {
    hideHint();
    rendererRef.current?.replayWithSound();
  };
  const toggleSound = () => {
    hideHint();
    rendererRef.current?.toggleMuted();
  };
  const toggleFullscreen = () => {
    hideHint();
    const slot = hostRef.current?.closest('.help-player');
    if (!slot) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      slot.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      className={`help-player ${muted ? 'is-muted' : ''} ${paused ? 'is-paused' : ''} ${showHint ? 'show-nav-hint' : ''}`}
      onPointerDown={hideHint}
      onMouseEnter={resetHint}
      onFocus={resetHint}
    >
      <div ref={hostRef} className="help-player__canvas" />
      {status === 'loading' && (
        <div className="help-player__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__label">
            <span className="mono">[ decoding mesh projection · sv3d/proj/mshp ]</span>
          </div>
        </div>
      )}
      {status === 'missing' && (
        <div className="help-player__overlay help-player__overlay--missing">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small dim">Asset not found</div>
            <div className="serif large">place <span className="mono">help_full.webm</span></div>
            <div className="serif large">at <span className="mono">resume/media/</span></div>
            <div className="mono small dim" style={{marginTop:'1em'}}>
              the page will boot the MESH decoder + drag-to-look 360° viewer
            </div>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="help-player__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small">Decoder error — check console</div>
          </div>
        </div>
      )}
      {status === 'ready' && (
        <>
          <div className="help-player__hud">
            <div className="hud-pill mono">
              <span className="hud-dot" /> projection · {projection || 'mesh'}
            </div>
            <div className="hud-pill mono dim">drag / swipe / wasd</div>
          </div>
          <div className="wasd-hint" aria-hidden="true">
            <div className="wasd-hint__grid mono">
              <span />
              <span className="wasd-key"><b>W</b><i>↑</i></span>
              <span />
              <span className="wasd-key"><b>A</b><i>←</i></span>
              <span className="wasd-key wasd-key--center"><b>S</b><i>↓</i></span>
              <span className="wasd-key"><b>D</b><i>→</i></span>
            </div>
          </div>
          <div className="video-controls video-controls--help" aria-label="HELP video controls">
            <button className="video-control video-control--primary mono" onClick={togglePlayback} aria-label={paused ? 'Play video' : 'Pause video'}>
              <span className={`video-control__icon ${paused ? 'video-control__icon--play' : 'video-control__icon--pause'}`} aria-hidden="true" />
              <span>{paused ? 'play' : 'pause'}</span>
            </button>
            <button className="video-control mono" onClick={replayWithSound} aria-label="Replay from beginning with sound">
              <span className="video-control__icon video-control__icon--replay" aria-hidden="true" />
              <span>replay</span>
            </button>
            <button className="video-control mono" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'}>
              <span className={`video-control__icon ${muted ? 'video-control__icon--sound-off' : 'video-control__icon--sound-on'}`} aria-hidden="true" />
              <span>{muted ? 'click for sound' : 'mute'}</span>
            </button>
            <button className="video-control video-control--icon mono" onClick={toggleFullscreen} aria-label="Enter fullscreen">
              <span className="video-control__icon video-control__icon--fullscreen" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  VideoSlot — flat-video placeholder w/ auto-fill when asset present
// ────────────────────────────────────────────────────────────────────

function VideoSlot({ src, label, fallbackPath }) {
  const videoRef = useRef(null);
  const slotIdRef = useRef(`video-slot-${Math.random().toString(36).slice(2)}`);
  const userHeldPlaybackRef = useRef(false);
  const [status, setStatus] = useState('loading'); // loading | ready | missing
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function probe() {
      const res = await fetch(src, { method: 'HEAD' }).catch(() => null);
      if (cancelled) return;
      if (res && res.ok) setStatus('ready'); else setStatus('missing');
    }
    probe();
    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'ready') return undefined;
    const syncAudio = () => setMuted(video.muted);
    const syncPlayback = () => setPaused(video.paused);
    const pauseOtherSlots = (event) => {
      if (event.detail?.id === slotIdRef.current) return;
      if (!event.detail?.userInitiated && userHeldPlaybackRef.current) return;
      userHeldPlaybackRef.current = false;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.pause();
    };
    video.addEventListener('volumechange', syncAudio);
    video.addEventListener('play', syncPlayback);
    video.addEventListener('pause', syncPlayback);
    window.addEventListener('resume-video-slot-active', pauseOtherSlots);
    syncAudio();
    syncPlayback();
    return () => {
      video.removeEventListener('volumechange', syncAudio);
      video.removeEventListener('play', syncPlayback);
      video.removeEventListener('pause', syncPlayback);
      window.removeEventListener('resume-video-slot-active', pauseOtherSlots);
    };
  }, [status]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'ready' || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.62 && video.paused) {
          activateSlot();
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          if (!userHeldPlaybackRef.current) video.pause();
        }
      },
      { threshold: [0, 0.2, 0.62, 1] }
    );
    const slot = video.closest('.video-slot');
    if (slot) observer.observe(slot);
    return () => observer.disconnect();
  }, [status]);

  function activateSlot({ withSound = false, restart = false, userInitiated = false } = {}) {
    const video = videoRef.current;
    if (!video) return;
    if (!userInitiated && window.__resumeHeldVideoSlot && window.__resumeHeldVideoSlot !== slotIdRef.current) return;
    window.dispatchEvent(new CustomEvent('resume-video-slot-active', {
      detail: { id: slotIdRef.current, userInitiated }
    }));
    if (restart) video.currentTime = 0;
    if (withSound) video.muted = false;
    if (userInitiated && !video.muted) {
      userHeldPlaybackRef.current = true;
      window.__resumeHeldVideoSlot = slotIdRef.current;
    }
    video.play().catch(() => {});
  }

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    window.dispatchEvent(new CustomEvent('resume-video-slot-active', {
      detail: { id: slotIdRef.current, userInitiated: true }
    }));
    video.muted = !video.muted;
    userHeldPlaybackRef.current = !video.muted;
    window.__resumeHeldVideoSlot = video.muted ? null : slotIdRef.current;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      activateSlot({ userInitiated: true });
    } else {
      userHeldPlaybackRef.current = false;
      if (window.__resumeHeldVideoSlot === slotIdRef.current) window.__resumeHeldVideoSlot = null;
      video.pause();
    }
  };

  const replayWithSound = () => activateSlot({ withSound: true, restart: true, userInitiated: true });

  const toggleFullscreen = () => {
    const slot = videoRef.current?.closest('.video-slot');
    if (!slot) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      slot.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      className={`video-slot ${muted ? 'is-muted' : ''} ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => activateSlot()}
      onFocus={() => activateSlot()}
    >
      {status === 'ready' && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="video-slot__video"
        />
      )}
      {status === 'loading' && (
        <div className="video-slot__overlay">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__label">
            <span className="mono">[ probing asset ]</span>
          </div>
        </div>
      )}
      {status === 'missing' && (
        <div className="video-slot__overlay video-slot__overlay--missing">
          <div className="help-player__placeholder-grid" />
          <div className="help-player__missing">
            <div className="mono small dim">Asset not found</div>
            <div className="serif large">place <span className="mono">{fallbackPath.split('/').pop()}</span></div>
            <div className="serif large">at <span className="mono">{fallbackPath.replace(/\/[^/]+$/, '/')}</span></div>
            <div className="mono small dim" style={{marginTop:'1em'}}>
              the slot will auto-mount the clip on next reload
            </div>
          </div>
        </div>
      )}
      {label && (
        <div className="help-player__hud">
          <div className="hud-pill mono">
            <span className="hud-dot" /> {label}
          </div>
        </div>
      )}
      {status === 'ready' && (
        <div className="video-controls" aria-label="Video controls">
          <button className="video-control video-control--primary mono" onClick={togglePlayback} aria-label={paused ? 'Play video' : 'Pause video'}>
            <span className={`video-control__icon ${paused ? 'video-control__icon--play' : 'video-control__icon--pause'}`} aria-hidden="true" />
            <span>{paused ? 'play' : 'pause'}</span>
          </button>
          <button className="video-control mono" onClick={replayWithSound} aria-label="Replay from beginning with sound">
            <span className="video-control__icon video-control__icon--replay" aria-hidden="true" />
            <span>replay</span>
          </button>
          <button className="video-control mono" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'}>
            <span className={`video-control__icon ${muted ? 'video-control__icon--sound-off' : 'video-control__icon--sound-on'}`} aria-hidden="true" />
            <span>{muted ? 'click for sound' : 'mute'}</span>
          </button>
          <button className="video-control video-control--icon mono" onClick={toggleFullscreen} aria-label="Enter fullscreen">
            <span className="video-control__icon video-control__icon--fullscreen" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  BlackbirdFeature — flat video + context (parallel to HELP)
// ────────────────────────────────────────────────────────────────────

function BlackbirdFeature({ innovationSrc, behindScenesSrc }) {
  return (
    <Section id="blackbird" label="04 · LIVE · THE MILL BLACKBIRD">
      <div className="help-feature">
        <div className="help-feature__player-col help-feature__player-col--wide">
          <div className="video-stack">
            <VideoSlot src={innovationSrc} fallbackPath="resume/media/blackbird-innovation.mp4" label="cannes lions innovation film · the mill blackbird" />
            <VideoSlot src={behindScenesSrc} fallbackPath="resume/media/blackbird.mp4" label="behind the scenes · chevrolet the human race" />
          </div>
        </div>
        <aside className="help-feature__notes help-feature__notes--match-stack">
          <h3 className="serif">The adjustable car. A three-year product arc.</h3>
          <p>
            <strong>The Mill Blackbird</strong> began as an unmet need in automotive advertising:
            shoot the spot before the car exists, or the trim is undecided, or the model isn't
            even painted yet. We answered it with a fully adjustable, drivable rig that maps to
            any production CG car body in post.
          </p>
          <p>
            As Technical Innovations Manager, I led the technical product management on
            this project across hardware, on-set workflow, and the CG pipeline. The rig
            went on to win the HPA Judges Award and a Cannes Gold Lion.
          </p>
          <p>
            The system later powered Chevrolet <em>The Human Race</em>, combining live video
            feeds, Arraiy positional tracking, Unreal Engine, and The Mill's Mill Cyclops
            virtual production toolkit so directors could see the Camaro rendered and
            composited into the shot in real time.
          </p>
          <dl className="blackbird-facts">
            <div>
              <dt className="mono">Physical rig</dt>
              <dd>Adjustable wheelbase, track width, suspension, and driving characteristics for multiple CG car bodies.</dd>
            </div>
            <div>
              <dt className="mono">Realtime view</dt>
              <dd>Live camera feeds and positional data pushed into Unreal for on-set composition decisions.</dd>
            </div>
            <div>
              <dt className="mono">Production bridge</dt>
              <dd>A practical platform connecting vehicle photography, tracking, virtual production, and final CG finishing.</dd>
            </div>
          </dl>
          <ul className="help-feature__chips mono">
            <li>Unreal Engine · real-time AR composite</li>
            <li>Mill Cyclops™ · virtual production toolkit</li>
            <li>Arraiy tracking · live positional data</li>
            <li>HPA · Judges Award · Creativity & Innovation</li>
            <li>Cannes Gold · Innovative Use of Technology</li>
          </ul>
        </aside>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Section primitives
// ────────────────────────────────────────────────────────────────────

function Section({ id, label, children, dense }) {
  return (
    <section id={id} className={`section ${dense ? 'section--dense' : ''}`}>
      <header className="section__header">
        <span className="section__rule" />
        <span className="section__label mono">{label}</span>
      </header>
      <div className="section__body">{children}</div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Header / identity
// ────────────────────────────────────────────────────────────────────

function Identity({ data }) {
  return (
    <header className="identity">
      <div className="identity__top mono dim">
        <span>{data.name}</span>
        <span className="identity__top-dot">●</span>
        <span>FOLIO · 2026</span>
        <span className="identity__top-dot">●</span>
        <span>{data.location}</span>
        <span className="identity__top-dot">●</span>
        <a href="https://www.linkedin.com/in/tawfeeq-martin-82991a14/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <BlackoutPoetryPanel />
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Summary
// ────────────────────────────────────────────────────────────────────

function Summary({ text }) {
  return (
    <Section id="summary" label="01 · SUMMARY">
      <p className="summary serif">{text}</p>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Experience
// ────────────────────────────────────────────────────────────────────

function Experience({ items }) {
  return (
    <Section id="experience" label="02 · EXPERIENCE">
      <ol className="experience">
        {items.map((job, i) => (
          <li key={i} className="job">
            <div className="job__rail">
              <span className="job__rail-dot" />
              <span className="job__rail-line" />
            </div>
            <div className="job__head">
              <div className="job__head-row">
                <h3 className="job__role serif">{job.role}</h3>
                {job.tag && <span className="job__tag mono">{job.tag}</span>}
              </div>
              <div className="job__meta">
                <span className="job__org">{job.org}</span>
                {job.where && <><span className="job__sep">·</span><span>{job.where}</span></>}
                <span className="job__sep">·</span>
                <span className="mono dim">{job.period}</span>
              </div>
            </div>
            <ul className="job__bullets">
              {job.bullets.map((b, j) => (<li key={j}>{b}</li>))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  HELP feature panel — wraps the player + context
// ────────────────────────────────────────────────────────────────────

function HelpFeature({ src }) {
  return (
    <Section id="help" label="03 · LIVE · MILL STITCH ™ ON HELP">
      <div className="help-hero">
        <div className="help-hero__intro">
          <h3 className="serif">A 360° film, served from its native projection.</h3>
          <p>
            <em>HELP</em> (dir. Justin Lin) was the first Hollywood-scale immersive cinematic
            experience built for mobile — a Google Spotlight Stories title delivered in a
            custom MESH projection rather than equirectangular video.
          </p>
        </div>
        <div className="help-hero__player">
          <HelpPlayer src={src} />
        </div>
        <div className="help-hero__details">
          <p>
            I led the on-set technology and co-invented <strong>Mill Stitch™</strong>, a
            real-time 360° pipeline that let the director see the surround action live during
            principal photography in the LA river basin.
          </p>
          <p>
            What you're watching here is decoded directly from that original format —
            <span className="mono"> sv3d → proj → mshp</span>, the geometry inflated and rendered
            on a sphere at the world origin. Drag to look around.
          </p>
        </div>
        <div className="help-hero__awards">
          <ul className="help-feature__chips mono">
            <li>Cannes Gold · Innovative Use of Tech</li>
            <li>Cannes Gold · VR</li>
            <li>SXSW Gold · AR/VR Breakthrough</li>
            <li>Webby · Technical Achievement</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Project (agiftoftime)
// ────────────────────────────────────────────────────────────────────

function ProjectCard({ data }) {
  return (
    <Section id="project" label="05 · INDEPENDENT · 2025">
      <div className="project">
        <div className="project__head">
          <h3 className="serif">{data.name}</h3>
          <div className="project__sub mono dim">{data.sub}</div>
        </div>
        <p className="project__body">{data.body}</p>
        <ul className="project__stack mono">
          {data.stack.map((s,i) => (<li key={i}>{s}</li>))}
        </ul>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Awards — filterable
// ────────────────────────────────────────────────────────────────────

function Awards({ items }) {
  const [filter, setFilter] = useState('all');
  const projects = useMemo(() => {
    const set = new Set(items.map(a => a.project.split('—')[0].trim()));
    return ['all', ...Array.from(set)];
  }, [items]);
  const filtered = filter === 'all' ? items : items.filter(a => a.project.startsWith(filter));
  return (
    <Section id="awards" label="06 · AWARDS & RECOGNITION">
      <div className="awards__filters mono">
        {['all','gold','silver','honor'].map(t => (
          <button
            key={t}
            className={`awards__filter ${filter===t?'is-on':''}`}
            onClick={() => setFilter(t)}
          >{t}</button>
        ))}
      </div>
      <ul className="awards">
        {items
          .filter(a => filter==='all' || a.tier===filter)
          .map((a,i) => (
            <li key={i} className={`award award--${a.tier}`}>
              <div className="award__tier mono">
                <span className={`award__tier-dot award__tier-dot--${a.tier}`} />
                {a.tier}
              </div>
              <div className="award__org mono">{a.org}</div>
              <div className="award__title">{a.title}</div>
              <div className="award__project serif italic">{a.project}</div>
              <div className="award__role mono dim">{a.role}</div>
            </li>
          ))}
      </ul>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Skills
// ────────────────────────────────────────────────────────────────────

function Skills({ groups }) {
  return (
    <Section id="skills" label="07 · TECHNICAL">
      <div className="skills">
        {groups.map((g,i) => (
          <div key={i} className="skill-group">
            <div className="skill-group__name mono">{g.group}</div>
            <ul className="skill-group__items">
              {g.items.map((it,j) => <li key={j}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Education
// ────────────────────────────────────────────────────────────────────

function Education({ items }) {
  return (
    <Section id="edu" label="08 · EDUCATION">
      <ul className="edu">
        {items.map((e,i) => (
          <li key={i} className="edu__row">
            <div className="edu__school serif">{e.school}</div>
            <div className="edu__degree">{e.degree}</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  References — flippable cards
// ────────────────────────────────────────────────────────────────────

function References({ items }) {
  const [active, setActive] = useState(0);
  return (
    <Section id="refs" label="09 · REFERENCES">
      <div className="refs">
        <div className="refs__quote">
          <div className="refs__qmark serif">“</div>
          <blockquote className="refs__text serif">
            {items[active].quote}
          </blockquote>
          <div className="refs__attribution">
            <div className="refs__name serif">{items[active].name}</div>
            <div className="refs__title mono">{items[active].title}</div>
            {items[active].sub && <div className="refs__sub mono dim">{items[active].sub}</div>}
          </div>
        </div>
        <ol className="refs__list">
          {items.map((r, i) => (
            <li key={i}>
              <button
                className={`refs__chip ${i===active?'is-on':''}`}
                onClick={() => setActive(i)}
              >
                <span className="refs__chip-num mono">{String(i+1).padStart(2,'0')}</span>
                <span className="refs__chip-name">{r.name}</span>
                <span className="refs__chip-title mono dim">{r.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  Footer
// ────────────────────────────────────────────────────────────────────

function Footer({ data }) {
  return (
    <footer className="page-footer mono dim">
      <div>
        <span>{data.name}</span>
        <span className="dot">●</span>
        <span>{data.location}</span>
        <span className="dot">●</span>
        <a href={`https://${data.site}`} target="_blank" rel="noreferrer">{data.site}</a>
      </div>
      <div className="page-footer__build">
        rev · 2026.05 · built with three.js + a parser for google's mesh projection
      </div>
    </footer>
  );
}

Object.assign(window, {
  HelpPlayer, HelpFeature, Identity, Summary,
  Experience, ProjectCard, Awards, Skills, Education, References, Footer,
  VideoSlot, BlackbirdFeature
});
