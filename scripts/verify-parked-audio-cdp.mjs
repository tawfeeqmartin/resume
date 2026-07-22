#!/usr/bin/env node

const DEBUG_PORT = Number(process.env.CDP_PORT || 9333);
const PAGE_MATCH = process.env.PAGE_MATCH || 'Resume.html';

const pages = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`).then((response) => response.json());
const page = pages.find((item) => item.type === 'page' && String(item.url || '').includes(PAGE_MATCH));
if (!page?.webSocketDebuggerUrl) throw new Error(`No ${PAGE_MATCH} page on CDP port ${DEBUG_PORT}`);

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 0;
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
};
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression, userGesture = false) => {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await send('Runtime.enable');
for (let attempt = 0; attempt < 40; attempt += 1) {
  if (await evaluate(`Boolean(document.querySelector('.landing-v1-shell'))`)) break;
  await wait(125);
}

const contextState = await evaluate(`(async () => {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return 'unsupported';
  const context = window.__resumeMacKeyAudioContext || new AudioContextCtor();
  await context.resume();
  window.__resumeMacKeyAudioContext = context;
  window.dispatchEvent(new CustomEvent('resume-mac-audio-ready'));
  return context.state;
})()`, true);
await wait(1200);
const directPlayback = await evaluate(`(async () => {
  const context = window.__resumeMacKeyAudioContext;
  const paths = [
    'media/audio/glitches/nebula-glitch-093.wav',
    'media/audio/glitches/nebula-glitch-070.wav',
    'media/audio/glitches/nebula-glitch-058.wav',
  ];
  const results = [];
  for (const path of paths) {
    const response = await fetch(path);
    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = 0.01;
    source.connect(gain);
    gain.connect(context.destination);
    await new Promise((resolve) => {
      source.onended = resolve;
      source.start();
    });
    source.disconnect();
    gain.disconnect();
    results.push({ path, duration: buffer.duration });
  }
  return results;
})()`, true);
await evaluate(`window.scrollTo(0, Math.round(window.innerHeight * 0.31))`);
await wait(1650);
const state = await evaluate(`(() => {
  const shell = document.querySelector('.landing-v1-shell');
  return {
    mounted: Boolean(shell),
    controller: Boolean(shell && 'overtureBeat' in shell.dataset),
    context: window.__resumeMacKeyAudioContext?.state || 'missing',
    beat: shell?.dataset.overtureBeat || '',
    arrival: shell?.dataset.parkedGlitch || '',
    idle: shell?.dataset.parkedIdle || '',
    audio: shell?.dataset.glitchAudio || '',
    root: document.getElementById('root')?.innerHTML.slice(0, 240) || '',
    body: document.body?.innerText.slice(0, 240) || '',
    bundle: [...document.scripts].map((script) => script.src).find((src) => src.includes('dist/app.js')) || '',
  };
})()`);
socket.close();

console.log(JSON.stringify({ initialContext: contextState, directPlayback, ...state }, null, 2));
if (contextState !== 'running' || state.context !== 'running') process.exitCode = 2;
if (!Array.isArray(directPlayback) || directPlayback.length !== 3 || directPlayback.some((item) => !(item.duration > 0))) process.exitCode = 3;
if (state.controller) {
  if (state.beat !== 'design-response' || state.arrival !== 'design-response') process.exitCode = 4;
  if (!state.idle.startsWith('design-response:')) process.exitCode = 5;
  if (!['parked-playing', 'idle-playing'].includes(state.audio)) process.exitCode = 6;
}
