import fs from 'node:fs/promises';

const chromePort = Number(process.env.CHROME_PORT || 9229);
const pageUrl = process.env.PAGE_URL
  || 'http://192.168.1.64:8021/Resume.html?build=hermes-visual-check';
const outputDir = process.env.OUTPUT_DIR || '/tmp/resume-visual-check';
const directStart = process.env.DIRECT_START === '1';
const manualPower = process.env.MANUAL_POWER === '1';
const designPreview = process.env.DESIGN_PREVIEW === '1';
const cameraPreview = process.env.CAMERA_PREVIEW === '1';
const reflowPreview = process.env.REFLOW_PREVIEW === '1';
const strudelPreview = process.env.STRUDEL_PREVIEW === '1';
const fastStrudelPreview = process.env.FAST_STRUDEL_PREVIEW === '1';
const fullScorePreview = process.env.FULL_SCORE_PREVIEW === '1';
const replReference = process.env.REPL_REFERENCE === '1';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const targets = await (await fetch(`http://127.0.0.1:${chromePort}/json`)).json();
const target = targets.find((item) => item.type === 'page');
if (!target?.webSocketDebuggerUrl) throw new Error('No Chrome page target found.');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let serial = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const payload = JSON.parse(event.data);
  if (!payload.id || !pending.has(payload.id)) return;
  const { resolve, reject } = pending.get(payload.id);
  pending.delete(payload.id);
  if (payload.error) reject(new Error(payload.error.message));
  else resolve(payload.result || {});
});

const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++serial;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const result = await command('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed.');
  }
  return result.result?.value;
};

const readState = () => evaluate(`(() => {
  const hero = document.querySelector('.tv-hero')?.dataset || {};
  const shell = document.querySelector('.landing-v1-shell')?.dataset || {};
  return {
    url: location.href,
    ready: document.readyState,
    hidden: document.hidden,
    focused: document.hasFocus(),
    activity: document.documentElement.dataset.resumePageActive || '',
    activityReason: document.documentElement.dataset.resumePageActivityReason || '',
    session: shell.companionSession || '',
    gate: shell.companionGate || '',
    wall: Number(hero.cycWallPowerProgress || 0),
    wallState: hero.cycWallPowerState || '',
    ceiling: hero.cycCeilingPowerState || '',
    floppy: hero.floppyMotion || '',
    camera: shell.introCameraPreset || '',
    beat: shell.introCameraBeat || '',
    stage: hero.cycStagePhase || '',
    processError: hero.cycDesignProcessError || '',
    strudelWall: hero.cycStrudelWall || '',
    strudelSection: hero.cycStrudelSection || '',
    strudelLane: hero.cycStrudelLane || '',
    strudelLines: Number(hero.cycStrudelSourceLines || 0),
    reelOwner: hero.filmReelOwner || '',
    reelTransport: hero.filmReelTransport || '',
  };
})()`);

const capture = async (name) => {
  const result = await command('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  });
  const path = `${outputDir}/${name}.png`;
  await fs.writeFile(path, Buffer.from(result.data, 'base64'));
  return path;
};

await fs.mkdir(outputDir, { recursive: true });
await command('Page.enable');
await command('Runtime.enable');
await command('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 968,
  deviceScaleFactor: 1,
  mobile: false,
});
await command('Emulation.setFocusEmulationEnabled', { enabled: true });
await command('Page.bringToFront');
await command('Page.addScriptToEvaluateOnNewDocument', {
  source: `(() => {
    try {
      localStorage.removeItem('resume.companion.session.v1');
      sessionStorage.removeItem('resume.companion.session.v1');
    } catch {}
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      const nativeResult = nativeMatchMedia(query);
      if (!String(query).includes('(pointer: fine)')) return nativeResult;
      return new Proxy(nativeResult, {
        get(target, property) {
          if (property === 'matches') return true;
          const value = Reflect.get(target, property, target);
          return typeof value === 'function' ? value.bind(target) : value;
        },
      });
    };
  })();`,
});
await command('Page.navigate', { url: pageUrl });

let state;
for (let attempt = 0; attempt < 160; attempt += 1) {
  await wait(100);
  try {
    state = await readState();
  } catch {
    // Navigation can replace the execution context between the CDP command
    // and evaluation. The next poll runs against the committed document.
    continue;
  }
  if (state.url === pageUrl
    && state.ready === 'complete'
    && state.session
    && state.wallState === 'off'
    && state.ceiling === 'off') break;
}
if (!state?.session || state.wallState !== 'off' || state.ceiling !== 'off') {
  throw new Error(`Companion scene did not initialize: ${JSON.stringify(state)}`);
}

// A headless CDP target can be visible but still lose the app's cross-tab
// foreground lease during navigation. Claim it explicitly so this QA run
// exercises the same foreground-only path as the user's active browser tab.
await evaluate(`(() => {
  window.focus();
  window.__resumePageActivity?.claim?.('hermes-cdp-visual-check');
  return {
    active: window.__resumeIsPageActive?.(),
    reason: document.documentElement.dataset.resumePageActivityReason || '',
  };
})()`);
await wait(80);

const results = [{
  label: 'idle',
  at: 0,
  state,
  screenshot: fastStrudelPreview ? '' : await capture('00-idle'),
}];
if (replReference) {
  await evaluate(`(() => {
    const macbook = document.querySelector('.strudel-repl__macbook');
    if (!macbook) return false;
    const veil = document.createElement('div');
    veil.id = 'hermes-repl-reference-veil';
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#f4f1e8;';
    document.body.appendChild(veil);
    const clone = macbook.cloneNode(true);
    clone.id = 'hermes-repl-reference-clone';
    clone.style.cssText += ';position:fixed;z-index:2147483001;left:50%;top:50%;width:860px;height:860px;max-width:none;margin:0;transform:translate(-50%,-50%);';
    document.body.appendChild(clone);
    return true;
  })()`);
  await wait(720);
  results.push({
    label: 'poetry-in-proof-reference',
    at: 720,
    state: await readState(),
    screenshot: await capture('poetry-in-proof-reference'),
  });
  console.log(JSON.stringify(results, null, 2));
  socket.close();
  process.exit(0);
}
if (strudelPreview) {
  await evaluate(`window.dispatchEvent(new CustomEvent(
    'resume-mac-screen-character',
    { detail: { action: 'type', char: 'd', stage: 0, reveal: 1 } }
  ))`);
  await wait(180);
  await evaluate(`window.dispatchEvent(new CustomEvent(
    'resume-mac-screen-character',
    { detail: { action: 'enter', char: '', stage: 0, reveal: 1 } }
  ))`);
  await wait(420);
  await evaluate(`window.__tvHeroCompanionCamera?.('hero', {
    instant: true,
    source: 'hermes-strudel-preview',
    beat: 'filmreel'
  })`);
  await evaluate(`(() => {
    const channels = [
      { id: 'boot', label: 'System', type: 'boot' },
      { id: 'filmreel', label: 'Film Reel', type: 'video' },
    ];
    window.__tvHeroSetChannelDefs?.(channels, { active: 1 });
    window.__tvHeroPageMode?.(true, { channels, active: 1 });
    window.__tvHeroTune?.(1, false);
    window.__tvHeroLiveStrudelWallPaint?.({
      source: window.__resumeStrudelAudioEngine?.compositionSource || '',
      section: 'chorus',
      lane: '',
      group: '',
      pulse: 0,
      bpm: window.__resumeStrudelAudioEngine?.bpm || 153,
    });
  })()`);
  await wait(900);
  results.push({
    label: 'strudel-wall-live',
    at: 900,
    state: await readState(),
    screenshot: await capture('strudel-wall-live'),
  });
  if (fullScorePreview) {
    await evaluate(`(() => {
      const token = document.querySelector('#strudel .strudel-repl__overlay .sr-tok[data-token="f4"]');
      token?.classList.add('is-flash');
      window.__tvHeroLiveStrudelWallPaint?.({
        source: document.querySelector('#strudel .strudel-repl__textarea')?.value || '',
        section: 'breakdown',
        lane: 'lead',
        group: 'melody',
        pulse: 1,
        bpm: window.__resumeStrudelAudioEngine?.bpm || 153,
        elapsedMs: 11200,
      });
    })()`);
    await wait(120);
    results.push({
      label: 'strudel-wall-final-lines',
      at: 11200,
      state: await readState(),
      screenshot: await capture('strudel-wall-final-lines'),
    });
  }
  if (!fastStrudelPreview) {
    await evaluate(`window.dispatchEvent(new CustomEvent('resume-midi-event', {
      detail: {
        source: 'strudel',
        type: 'noteon',
        section: 'chorus',
        group: 'drums',
        lane: 'kick',
        note: 36,
        velocity: 1,
        raw: { s: 'bd', note: 36 },
      },
    }))`);
    await wait(90);
    results.push({
      label: 'strudel-wall-kick',
      at: 990,
      state: await readState(),
      screenshot: await capture('strudel-wall-kick'),
    });
    await evaluate(`(() => {
      const channels = [
        { id: 'boot', label: 'System', type: 'boot' },
        { id: 'filmreel', label: 'Film Reel', type: 'video' },
      ];
      window.__tvHeroSetChannelDefs?.(channels, { active: 0 });
      window.__tvHeroPageMode?.(true, { channels, active: 0 });
      window.__tvHeroTune?.(0, false);
    })()`);
    await wait(320);
    results.push({
      label: 'strudel-wall-released',
      at: 1310,
      state: await readState(),
      screenshot: await capture('strudel-wall-released'),
    });
  }
} else if (reflowPreview) {
  results.push({
    label: 'before-reflow',
    at: 0,
    state: await readState(),
    screenshot: await capture('reflow-before'),
  });
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1392,
    height: 968,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await wait(1);
  results.push({
    label: 'reflow-immediate',
    at: 1,
    state: await readState(),
    screenshot: await capture('reflow-immediate'),
  });
  await wait(80);
  results.push({
    label: 'reflow-settled',
    at: 81,
    state: await readState(),
    screenshot: await capture('reflow-settled'),
  });
} else if (cameraPreview) {
  await evaluate(`window.__tvHeroCompanionCamera?.('typing', {
    instant: true,
    source: 'hermes-camera-preview',
    beat: 'design-command'
  })`);
  await wait(120);
  results.push({
    label: 'typing-close',
    at: 0,
    state: await readState(),
    screenshot: await capture('camera-typing-close'),
  });
  await evaluate(`window.__tvHeroCompanionCamera?.('design', {
    duration: 420,
    easing: 'snap',
    source: 'hermes-camera-preview',
    beat: 'design-response'
  })`);
  await wait(500);
  results.push({
    label: 'design-enter-wide',
    at: 500,
    state: await readState(),
    screenshot: await capture('camera-design-enter-wide'),
  });
} else if (designPreview) {
  await evaluate(`window.__tvHeroCompanionCamera?.('design', {
    instant: true,
    source: 'hermes-design-preview',
    beat: 'design-response'
  })`);
  await wait(120);
  await evaluate(`window.dispatchEvent(new CustomEvent(
    'resume-mac-screen-character',
    { detail: { action: 'type', char: 'd', stage: 0, reveal: 1 } }
  ))`);
  await wait(80);
  await evaluate(`window.dispatchEvent(new CustomEvent(
    'resume-mac-screen-character',
    { detail: { action: 'enter', char: '', stage: 0, reveal: 1 } }
  ))`);
  await wait(160);
  const previewSteps = [
    { sequence: 3, frame: 2, label: 'geometry' },
    { sequence: 8, frame: 7, label: 'planning' },
    { sequence: 12, frame: 13, label: 'ai-skeleton' },
    { sequence: 13, frame: 11, label: 'constellation' },
  ];
  for (const preview of previewSteps) {
    await evaluate(`(() => {
      const shell = document.querySelector('.landing-v1-shell');
      if (shell) shell.dataset.designStoryStep = '${preview.sequence}';
      window.dispatchEvent(new CustomEvent('resume-crt-parked-idle', {
        detail: {
          phase: 'design',
          source: 'hermes-design-preview',
          sequence: ${preview.sequence},
          mediaFrameIndex: ${preview.frame},
          durationMs: 1600,
          visualDurationMs: 42,
          audioDurationMs: 0
        }
      }));
    })()`);
    await wait(520);
    results.push({
      label: preview.label,
      at: null,
      state: await readState(),
      screenshot: await capture(`design-${preview.label}`),
    });
  }
} else if (manualPower) {
  await evaluate(`window.dispatchEvent(new CustomEvent(
    'resume-mac-screen-character',
    { detail: { action: 'type', char: 'd', stage: 0, reveal: 0.45 } }
  ))`);
  await wait(400);
  results.push({
    label: 'manual-partial-power',
    at: 400,
    state: await readState(),
    screenshot: await capture('01-manual-partial-power'),
  });
  await evaluate(`window.dispatchEvent(new CustomEvent(
    'resume-mac-screen-character',
    { detail: { action: 'enter', char: '', stage: 0, reveal: 1 } }
  ))`);
  await wait(400);
  results.push({
    label: 'manual-full-power',
    at: 800,
    state: await readState(),
    screenshot: await capture('02-manual-full-power'),
  });
  await evaluate(`window.dispatchEvent(new CustomEvent('resume-crt-wall-power-reset'))`);
} else {
  if (directStart) {
    await evaluate(`window.__resumePageActivity?.claim?.('hermes-cdp-direct-start')`);
    await evaluate(`window.dispatchEvent(new CustomEvent('resume-companion-start-intro'))`);
  } else {
    await fetch('http://192.168.1.64:8021/api/companion/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: state.session }),
    });
  }

  for (let attempt = 0; attempt < 140; attempt += 1) {
    await wait(20);
    const bootState = await readState();
    if (bootState.wall > 0 && bootState.wall < 1) {
      results.push({
        label: 'first-powered-cabinets',
        at: null,
        state: bootState,
        screenshot: await capture('01-first-powered-cabinets'),
      });
      break;
    }
  }

  const checkpoints = [250, 650, 1050, 1450, 1700, 2200, 2500, 3000, 3650];
  let elapsed = 0;
  for (const checkpoint of checkpoints) {
    await wait(checkpoint - elapsed);
    elapsed = checkpoint;
    const checkpointState = await readState();
    results.push({
      label: `t${checkpoint}`,
      at: checkpoint,
      state: checkpointState,
      screenshot: await capture(`t${String(checkpoint).padStart(4, '0')}`),
    });
  }

  if (directStart) {
    await evaluate(`window.dispatchEvent(new CustomEvent('resume-companion-stop-intro'))`);
  } else {
    await fetch('http://192.168.1.64:8021/api/companion/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: state.session }),
    });
  }
}

await fs.writeFile(
  `${outputDir}/report.json`,
  `${JSON.stringify(results, null, 2)}\n`,
);
console.log(JSON.stringify(results, null, 2));
socket.close();
