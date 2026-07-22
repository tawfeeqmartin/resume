#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number.parseInt(process.argv[2] || process.env.PORT || '8021', 10);
// The portfolio's companion controller is intentionally reachable by phones on
// the same Wi-Fi network during local testing.
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.glb', 'model/gltf-binary'],
  ['.gltf', 'model/gltf+json'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.mov', 'video/quicktime'],
  ['.mp3', 'audio/mpeg'],
  ['.mp4', 'video/mp4'],
  ['.ogg', 'audio/ogg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.wav', 'audio/wav'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
]);

const MAC_ASCII_DEFAULT_CONFIG = Object.freeze({
  enabled: false,
  chars: '.,:;-=+xX80S#@',
  charColors: {
    S: '#0a84ff',
    '#': '#ffd60a',
    '@': '#ff453a',
  },
  tileSize: 23,
  minFrameMs: 48,
  fontScale: 1.02,
  brightness: 1,
  contrast: 2.54,
  threshold: 0.73,
  coverage: 1,
  density: 1,
  edgeEmphasis: 0,
  backgroundBlur: 40,
  backgroundOpacity: 0.35,
  opacity: 1.35,
  darken: 0.36,
  jitter: 1.35,
  scanline: 0.28,
});

let macAsciiConfig = { ...MAC_ASCII_DEFAULT_CONFIG };
let macAsciiRevision = 1;
const CONTACT_OUTBOX_PATH = path.join(ROOT, 'output', 'contact-messages.ndjson');
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'tawfeeqmartin@gmail.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Tawfeeq Martin Website <onboarding@resend.dev>';
const contactRateLimit = new Map();
const companionSessions = new Map();
const COMPANION_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const COMPANION_SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const COMPANION_SERVER_INSTANCE = randomBytes(8).toString('base64url');
const COMPANION_LONG_POLL_MAX_MS = 25_000;
const COMPANION_STATE_PATH = process.env.COMPANION_STATE_PATH
  || path.join(os.tmpdir(), 'tawfeeq-resume-companion-sessions-v1.json');

const MAC_ASCII_NAMED_COLORS = Object.freeze({
  red: '#ff453a',
  yellow: '#ffd60a',
  blue: '#0a84ff',
  cyan: '#64d2ff',
  green: '#32d74b',
  magenta: '#ff375f',
  orange: '#ff9f0a',
  purple: '#bf5af2',
  white: '#ffffff',
});

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function parseBoolean(value, fallback) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeMacAsciiColor(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return '';
  if (MAC_ASCII_NAMED_COLORS[raw]) return MAC_ASCII_NAMED_COLORS[raw];
  const hex = raw.replace(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i, '#$1');
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return '';
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
  }
  return hex.toLowerCase();
}

function normalizeMacAsciiCharColors(input, fallback = {}) {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : fallback;
  const colors = {};
  for (const [key, value] of Object.entries(source || {}).slice(0, 96)) {
    const char = Array.from(String(key ?? ''))[0];
    const color = normalizeMacAsciiColor(value);
    if (char && color) colors[char] = color;
  }
  return colors;
}

function normalizeMacAsciiConfig(input = {}, fallback = MAC_ASCII_DEFAULT_CONFIG) {
  const base = fallback || MAC_ASCII_DEFAULT_CONFIG;
  const rawChars = input.chars ?? base.chars;
  const chars = String(rawChars ?? '').slice(0, 96);
  return {
    enabled: parseBoolean(input.enabled, base.enabled),
    chars: chars.trim() ? chars : base.chars,
    charColors: normalizeMacAsciiCharColors(input.charColors ?? base.charColors, base.charColors),
    tileSize: clampNumber(input.tileSize, base.tileSize, 6, 36),
    minFrameMs: clampNumber(input.minFrameMs, base.minFrameMs, 16, 180),
    fontScale: clampNumber(input.fontScale, base.fontScale, 0.55, 1.8),
    brightness: clampNumber(input.brightness, base.brightness, -1, 1),
    contrast: clampNumber(input.contrast, base.contrast, 0.1, 3),
    threshold: clampNumber(input.threshold, base.threshold, 0, 0.95),
    coverage: clampNumber(input.coverage, base.coverage, 0, 1),
    density: clampNumber(input.density, base.density, 0.2, 2.5),
    edgeEmphasis: clampNumber(input.edgeEmphasis, base.edgeEmphasis, 0, 2),
    backgroundBlur: clampNumber(input.backgroundBlur, base.backgroundBlur, 0, 40),
    backgroundOpacity: clampNumber(input.backgroundOpacity, base.backgroundOpacity, 0, 1),
    opacity: clampNumber(input.opacity, base.opacity, 0, 1.35),
    darken: clampNumber(input.darken, base.darken, 0, 0.85),
    jitter: clampNumber(input.jitter, base.jitter, 0, 4),
    scanline: clampNumber(input.scanline, base.scanline, 0, 0.75),
  };
}

function send(res, status, body, extraHeaders = {}) {
  const payload = Buffer.from(body);
  res.writeHead(status, {
    'Content-Length': payload.byteLength,
    'Content-Type': 'text/plain; charset=utf-8',
    ...extraHeaders,
  });
  res.end(payload);
}

function sendJson(req, res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload, null, 2);
  const bytes = Buffer.byteLength(body);
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Length': String(bytes),
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  if (req.method === 'HEAD') res.end();
  else res.end(body);
}

function sendHtml(req, res, status, body, extraHeaders = {}) {
  const bytes = Buffer.byteLength(body);
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Length': String(bytes),
    'Content-Type': 'text/html; charset=utf-8',
    ...extraHeaders,
  });
  if (req.method === 'HEAD') res.end();
  else res.end(body);
}

function sendSvg(req, res, status, body, extraHeaders = {}) {
  const bytes = Buffer.byteLength(body);
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Length': String(bytes),
    'Content-Type': 'image/svg+xml; charset=utf-8',
    ...extraHeaders,
  });
  if (req.method === 'HEAD') res.end();
  else res.end(body);
}

function readJsonBody(req, limitBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > limitBytes) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function validateContactPayload(input = {}) {
  const name = String(input.name || '').trim().slice(0, 80);
  const email = String(input.email || '').trim().slice(0, 120);
  const message = String(input.message || '').trim().slice(0, 2000);
  const company = String(input.company || '').trim().slice(0, 120);
  if (company) return { bot: true };
  if (name.length < 2) return { error: 'Please enter your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
  if (message.length < 3) return { error: 'Please enter a message.' };
  return { name, email, message };
}

async function deliverContactWithResend(contact) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { delivered: false };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: contact.email,
      subject: `Website note from ${contact.name}`,
      text: [
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        '',
        contact.message,
      ].join('\n'),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Email delivery failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ''}`);
  }
  const result = await response.json().catch(() => ({}));
  return { delivered: true, id: result.id || '' };
}

async function handleContactRoute(req, res, url) {
  if (url.pathname !== '/api/contact') return false;
  if (req.method !== 'POST') {
    sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
    return true;
  }

  const key = req.socket.remoteAddress || 'local';
  const now = Date.now();
  const recent = (contactRateLimit.get(key) || []).filter((timestamp) => now - timestamp < 10 * 60 * 1000);
  if (recent.length >= 5) {
    sendJson(req, res, 429, { ok: false, error: 'Too many messages. Please try again in a few minutes.' });
    return true;
  }
  recent.push(now);
  contactRateLimit.set(key, recent);

  try {
    const payload = validateContactPayload(await readJsonBody(req, 12 * 1024));
    if (payload.bot) {
      sendJson(req, res, 200, { ok: true, delivered: true });
      return true;
    }
    if (payload.error) {
      sendJson(req, res, 400, { ok: false, error: payload.error });
      return true;
    }

    fs.mkdirSync(path.dirname(CONTACT_OUTBOX_PATH), { recursive: true });
    fs.appendFileSync(CONTACT_OUTBOX_PATH, `${JSON.stringify({
      receivedAt: new Date().toISOString(),
      name: payload.name,
      email: payload.email,
      message: payload.message,
    })}\n`, { encoding: 'utf8', mode: 0o600 });

    const delivery = await deliverContactWithResend(payload);
    sendJson(req, res, 200, {
      ok: true,
      delivered: delivery.delivered,
      stored: true,
      id: delivery.id || '',
    });
  } catch (error) {
    console.error('Contact submission failed:', error?.message || error);
    sendJson(req, res, 502, { ok: false, error: 'The message could not be delivered right now.' });
  }
  return true;
}

function renderMacAsciiControlPage() {
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mac ASCII Control</title>
<style>
  :root {
    color-scheme: dark;
    --bg: #0b0b0b;
    --panel: #171717;
    --ink: #f1efe4;
    --muted: #aaa48f;
    --line: #34312a;
    --accent: #e0cb6d;
    --button: #24211a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    font: 14px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  main {
    width: min(820px, calc(100vw - 32px));
    margin: 0 auto;
    padding: 28px 0 40px;
  }
  header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: end;
    border-bottom: 1px solid var(--line);
    padding-bottom: 16px;
    margin-bottom: 18px;
  }
  h1 {
    margin: 0;
    font: 700 18px/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0;
  }
  p { color: var(--muted); margin: 8px 0 0; max-width: 58ch; }
  a { color: var(--accent); text-decoration: none; }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 14px;
  }
  label {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr) 54px;
    gap: 12px;
    align-items: center;
    min-height: 36px;
  }
  label + label { margin-top: 12px; }
  input[type="text"],
  textarea {
    width: 100%;
    min-width: 0;
    color: var(--ink);
    background: #080808;
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 8px 10px;
    font: inherit;
  }
  textarea {
    min-height: 92px;
    line-height: 1.35;
    resize: vertical;
  }
  .textarea-row {
    align-items: start;
    min-height: 92px;
  }
  .textarea-row > span,
  .textarea-row > output { padding-top: 8px; }
  input[type="range"] { width: 100%; accent-color: var(--accent); }
  input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); }
  output { color: var(--muted); text-align: right; }
  .span-all { grid-column: 1 / -1; }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-top: 14px;
  }
  button {
    color: var(--ink);
    background: var(--button);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 9px 12px;
    font: inherit;
    cursor: pointer;
  }
  button:hover { border-color: var(--accent); }
  .status { color: var(--muted); margin-left: auto; }
  .swatch {
    min-height: 120px;
    background: #050505;
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 12px;
    overflow: hidden;
    white-space: pre-wrap;
    color: var(--accent);
  }
  @media (max-width: 720px) {
    header { display: block; }
    .grid { grid-template-columns: 1fr; }
    label { grid-template-columns: 1fr; gap: 6px; }
    output { text-align: left; }
    .status { margin-left: 0; width: 100%; }
  }
</style>
<main>
  <header>
    <div>
      <h1>Mac ASCII Bass Filter</h1>
      <p>Open the preview in another tab, start the Mac, then tune these controls. Changes are served from memory by the local dev server.</p>
    </div>
    <a href="/Resume.html" target="_blank" rel="noreferrer">Open preview</a>
  </header>

  <section class="grid">
    <div class="panel span-all">
      <label>
        <span>Enabled</span>
        <input id="enabled" type="checkbox">
        <output id="enabledOut"></output>
      </label>
      <label>
        <span>Characters</span>
        <input id="chars" type="text" spellcheck="false">
        <output id="charsOut"></output>
      </label>
      <label class="textarea-row">
        <span>Character colors</span>
        <textarea id="charColors" rows="4" spellcheck="false" placeholder="@ red&#10;# yellow&#10;S blue"></textarea>
        <output id="charColorsOut"></output>
      </label>
    </div>

    <div class="panel">
      <label>
        <span>Tile size</span>
        <input id="tileSize" type="range" min="6" max="36" step="1">
        <output id="tileSizeOut"></output>
      </label>
      <label>
        <span>Frame ms</span>
        <input id="minFrameMs" type="range" min="16" max="180" step="1">
        <output id="minFrameMsOut"></output>
      </label>
      <label>
        <span>Font scale</span>
        <input id="fontScale" type="range" min="0.55" max="1.8" step="0.01">
        <output id="fontScaleOut"></output>
      </label>
    </div>

    <div class="panel">
      <label>
        <span>Brightness</span>
        <input id="brightness" type="range" min="-1" max="1" step="0.01">
        <output id="brightnessOut"></output>
      </label>
      <label>
        <span>Contrast</span>
        <input id="contrast" type="range" min="0.1" max="3" step="0.01">
        <output id="contrastOut"></output>
      </label>
      <label>
        <span>Threshold</span>
        <input id="threshold" type="range" min="0" max="0.95" step="0.01">
        <output id="thresholdOut"></output>
      </label>
      <label>
        <span>Coverage</span>
        <input id="coverage" type="range" min="0" max="1" step="0.01">
        <output id="coverageOut"></output>
      </label>
      <label>
        <span>Density</span>
        <input id="density" type="range" min="0.2" max="2.5" step="0.01">
        <output id="densityOut"></output>
      </label>
      <label>
        <span>Edge emphasis</span>
        <input id="edgeEmphasis" type="range" min="0" max="2" step="0.01">
        <output id="edgeEmphasisOut"></output>
      </label>
    </div>

    <div class="panel">
      <label>
        <span>Opacity</span>
        <input id="opacity" type="range" min="0" max="1.35" step="0.01">
        <output id="opacityOut"></output>
      </label>
      <label>
        <span>BG blur</span>
        <input id="backgroundBlur" type="range" min="0" max="40" step="1">
        <output id="backgroundBlurOut"></output>
      </label>
      <label>
        <span>BG opacity</span>
        <input id="backgroundOpacity" type="range" min="0" max="1" step="0.01">
        <output id="backgroundOpacityOut"></output>
      </label>
      <label>
        <span>Darken</span>
        <input id="darken" type="range" min="0" max="0.85" step="0.01">
        <output id="darkenOut"></output>
      </label>
      <label>
        <span>Jitter</span>
        <input id="jitter" type="range" min="0" max="4" step="0.01">
        <output id="jitterOut"></output>
      </label>
      <label>
        <span>Scanline</span>
        <input id="scanline" type="range" min="0" max="0.75" step="0.01">
        <output id="scanlineOut"></output>
      </label>
    </div>

    <div class="panel span-all">
      <div id="swatch" class="swatch" aria-label="Character preview"></div>
      <div class="actions">
        <button id="pulse" type="button">Test bass hit</button>
        <button id="invert" type="button">Invert chars</button>
        <button id="reset" type="button">Reset defaults</button>
        <span id="status" class="status">Loading</span>
      </div>
    </div>
  </section>
</main>
<script>
const fields = [
  'tileSize',
  'minFrameMs',
  'fontScale',
  'brightness',
  'contrast',
  'threshold',
  'coverage',
  'density',
  'edgeEmphasis',
  'opacity',
  'backgroundBlur',
  'backgroundOpacity',
  'darken',
  'jitter',
  'scanline',
];
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('resume-mac-ascii-control-v1') : null;
const statusEl = document.getElementById('status');
let saveTimer = 0;
let current = null;
const NAMED_COLORS = {
  red: '#ff453a',
  yellow: '#ffd60a',
  blue: '#0a84ff',
  cyan: '#64d2ff',
  green: '#32d74b',
  magenta: '#ff375f',
  orange: '#ff9f0a',
  purple: '#bf5af2',
  white: '#ffffff',
};

function normalizeColor(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (NAMED_COLORS[raw]) return NAMED_COLORS[raw];
  const hex = raw.replace(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i, '#$1');
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return '';
  if (hex.length === 4) return ('#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]).toLowerCase();
  return hex.toLowerCase();
}

function parseCharColors(text) {
  const colors = {};
  const lines = String(text || '').split(/\\r?\\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('//')) continue;
    const parts = line.split(/\\s+/);
    const char = Array.from(parts.shift() || '')[0];
    const color = normalizeColor(parts.join(' '));
    if (char && color) colors[char] = color;
  }
  return colors;
}

function formatCharColors(colors, chars) {
  const entries = [];
  const seen = new Set();
  for (const char of Array.from(String(chars || ''))) {
    if (colors?.[char] && !seen.has(char)) {
      entries.push([char, colors[char]]);
      seen.add(char);
    }
  }
  for (const [char, color] of Object.entries(colors || {})) {
    if (!seen.has(char)) entries.push([char, color]);
  }
  return entries.map(([char, color]) => char + ' ' + color).join('\\n');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function renderChar(char, colors) {
  if (char === ' ') return '&nbsp;';
  const escaped = escapeHtml(char);
  const color = colors?.[char];
  return color ? '<span style="color:' + color + '">' + escaped + '</span>' : escaped;
}

function readForm() {
  const config = {
    enabled: document.getElementById('enabled').checked,
    chars: document.getElementById('chars').value,
    charColors: parseCharColors(document.getElementById('charColors').value),
  };
  for (const id of fields) config[id] = Number(document.getElementById(id).value);
  return config;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function formatValue(id, value) {
  if (id === 'tileSize' || id === 'minFrameMs' || id === 'backgroundBlur') return String(Math.round(value));
  return Number(value).toFixed(2);
}

function renderSwatch(config) {
  const chars = String(config.chars || '.,:;-=+xX80S#@');
  const colors = config.charColors || {};
  const rows = [];
  for (let y = 0; y < 7; y++) {
    let line = '';
    for (let x = 0; x < 54; x++) {
      const source = x / 53;
      const edge = Math.abs(Math.sin(x * 0.42 + y * 1.6)) * 0.18 * (config.edgeEmphasis || 0);
      let mapped = (source - 0.5) * (config.contrast || 1) + 0.5 + (config.brightness || 0) + edge;
      mapped = Math.max(0, Math.min(1, mapped * (config.density || 1)));
      if ((config.threshold || 0) > 0 && mapped < config.threshold) {
        line += '&nbsp;';
        continue;
      }
      if ((config.threshold || 0) > 0) {
        mapped = Math.max(0, Math.min(1, (mapped - config.threshold) / Math.max(0.001, 1 - config.threshold)));
      }
      if ((config.coverage ?? 1) < 1) {
        const gate = (config.coverage || 0) * (0.35 + mapped * 0.65);
        const noise = (Math.sin(x * 12.99 + y * 78.23) * 43758.54) % 1;
        if (Math.abs(noise) > gate) {
          line += '&nbsp;';
          continue;
        }
      }
      const t = mapped * (chars.length - 1);
      const jitter = Math.sin(x * 0.77 + y * 1.9) * config.jitter * 0.18;
      line += renderChar(chars[Math.max(0, Math.min(chars.length - 1, Math.round(t + jitter)))] || ' ', colors);
    }
    rows.push(line);
  }
  document.getElementById('swatch').innerHTML = rows.join('<br>');
}

function render(config, options = {}) {
  current = config;
  document.getElementById('enabled').checked = Boolean(config.enabled);
  document.getElementById('enabledOut').textContent = config.enabled ? 'on' : 'off';
  document.getElementById('chars').value = config.chars || '';
  document.getElementById('charsOut').textContent = String(config.chars || '').length + ' chars';
  if (!options.preserveCharColors) {
    document.getElementById('charColors').value = formatCharColors(config.charColors || {}, config.chars);
  }
  const colorCount = Object.keys(config.charColors || {}).length;
  document.getElementById('charColorsOut').textContent = colorCount + (colorCount === 1 ? ' color' : ' colors');
  for (const id of fields) {
    document.getElementById(id).value = config[id];
    document.getElementById(id + 'Out').textContent = formatValue(id, config[id]);
  }
  renderSwatch(config);
}

async function postConfig(config) {
  const response = await fetch('/api/mac-ascii-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Save failed: ' + response.status);
  const payload = await response.json();
  render(payload.config, { preserveCharColors: document.activeElement === document.getElementById('charColors') });
  channel?.postMessage({ type: 'config', payload });
  setStatus('Saved rev ' + payload.revision);
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  const config = readForm();
  render(config, { preserveCharColors: document.activeElement === document.getElementById('charColors') });
  saveTimer = window.setTimeout(() => {
    postConfig(readForm()).catch((error) => setStatus(error.message));
  }, 90);
}

async function load() {
  const response = await fetch('/api/mac-ascii-config', { cache: 'no-store' });
  const payload = await response.json();
  render(payload.config);
  setStatus('Loaded rev ' + payload.revision);
}

for (const id of ['enabled', 'chars', 'charColors', ...fields]) {
  const el = document.getElementById(id);
  el.addEventListener(id === 'chars' ? 'input' : 'input', scheduleSave);
  el.addEventListener('change', scheduleSave);
}

document.getElementById('pulse').addEventListener('click', () => {
  channel?.postMessage({
    type: 'pulse',
    id: Date.now(),
    strength: 1.45,
    duration: 220,
  });
  setStatus('Test pulse sent');
});

document.getElementById('invert').addEventListener('click', () => {
  const charsInput = document.getElementById('chars');
  charsInput.value = Array.from(charsInput.value || '').reverse().join('');
  scheduleSave();
});

document.getElementById('reset').addEventListener('click', async () => {
  const response = await fetch('/api/mac-ascii-reset', { method: 'POST' });
  const payload = await response.json();
  render(payload.config);
  channel?.postMessage({ type: 'config', payload });
  setStatus('Reset rev ' + payload.revision);
});

load().catch((error) => setStatus(error.message));
</script>
</html>`;
}

async function handleMacAsciiControlRoute(req, res, url) {
  if (url.pathname === '/mac-ascii-control' || url.pathname === '/mac-ascii-control.html') {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      send(res, 405, 'Method not allowed\n', { Allow: 'GET, HEAD, OPTIONS' });
      return true;
    }
    sendHtml(req, res, 200, renderMacAsciiControlPage());
    return true;
  }

  if (url.pathname === '/api/mac-ascii-config') {
    if (req.method === 'GET' || req.method === 'HEAD') {
      sendJson(req, res, 200, { config: macAsciiConfig, revision: macAsciiRevision });
      return true;
    }
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
      try {
        const input = await readJsonBody(req);
        macAsciiConfig = normalizeMacAsciiConfig(input, macAsciiConfig);
        macAsciiRevision += 1;
        sendJson(req, res, 200, { config: macAsciiConfig, revision: macAsciiRevision });
      } catch (error) {
        sendJson(req, res, 400, { error: error?.message || 'Invalid JSON body' });
      }
      return true;
    }
    send(res, 405, 'Method not allowed\n', { Allow: 'GET, HEAD, POST, PATCH, PUT, OPTIONS' });
    return true;
  }

  if (url.pathname === '/api/mac-ascii-reset') {
    if (req.method !== 'POST') {
      send(res, 405, 'Method not allowed\n', { Allow: 'POST, OPTIONS' });
      return true;
    }
    macAsciiConfig = { ...MAC_ASCII_DEFAULT_CONFIG };
    macAsciiRevision += 1;
    sendJson(req, res, 200, { config: macAsciiConfig, revision: macAsciiRevision });
    return true;
  }

  return false;
}

function getLanAddress() {
  const configured = String(process.env.COMPANION_HOST || '').trim();
  if (configured) return configured;

  const interfaces = os.networkInterfaces();
  const preferredNames = ['en0', 'en1', 'eth0', 'wlan0'];
  const candidates = [];
  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses || []) {
      if (address.family !== 'IPv4' || address.internal) continue;
      if (address.address.startsWith('169.254.')) continue;
      candidates.push({ name, address: address.address });
    }
  }
  const privateAddress = (address) => (
    address.startsWith('10.')
    || address.startsWith('192.168.')
    || /^172\.(1[6-9]|2\d|3[01])\./.test(address)
  );
  candidates.sort((a, b) => {
    const aPreferred = preferredNames.indexOf(a.name);
    const bPreferred = preferredNames.indexOf(b.name);
    const aRank = aPreferred >= 0 ? aPreferred : preferredNames.length + (privateAddress(a.address) ? 0 : 1);
    const bRank = bPreferred >= 0 ? bPreferred : preferredNames.length + (privateAddress(b.address) ? 0 : 1);
    return aRank - bRank;
  });
  return candidates[0]?.address || '127.0.0.1';
}

function companionOrigin() {
  return `http://${getLanAddress()}:${PORT}`;
}

function createCompanionSession(overrides = {}) {
  const now = Date.now();
  const command = ['waiting', 'stop', 'start', 'channel', 'camera'].includes(overrides.command)
    ? overrides.command
    : 'stop';
  const displayMode = overrides.displayMode === 'channels' ? 'channels' : 'intro';
  return {
    createdAt: Number(overrides.createdAt) || now,
    updatedAt: Number(overrides.updatedAt) || now,
    revision: Math.max(0, Number(overrides.revision) || 0),
    startedAt: Math.max(0, Number(overrides.startedAt) || 0),
    command,
    displayMode,
    activeChannel: displayMode === 'channels' ? String(overrides.activeChannel || '') : '',
    activeCamera: String(overrides.activeCamera || 'hero'),
    visitorName: String(overrides.visitorName || '').trim().slice(0, 24),
  };
}

function persistCompanionSessions() {
  try {
    const tempPath = `${COMPANION_STATE_PATH}.tmp`;
    const payload = {
      version: 1,
      savedAt: Date.now(),
      sessions: Object.fromEntries(companionSessions),
    };
    fs.writeFileSync(tempPath, JSON.stringify(payload), { mode: 0o600 });
    fs.renameSync(tempPath, COMPANION_STATE_PATH);
  } catch (error) {
    console.warn('[companion] could not persist session state:', error?.message || error);
  }
}

function loadCompanionSessions() {
  try {
    const payload = JSON.parse(fs.readFileSync(COMPANION_STATE_PATH, 'utf8'));
    const sessions = payload?.sessions && typeof payload.sessions === 'object'
      ? payload.sessions
      : {};
    for (const [id, value] of Object.entries(sessions)) {
      if (!COMPANION_SESSION_ID_PATTERN.test(id)) continue;
      companionSessions.set(id, createCompanionSession(value));
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.warn('[companion] could not restore session state:', error?.message || error);
    }
  }
}

function pruneCompanionSessions() {
  const cutoff = Date.now() - COMPANION_SESSION_TTL_MS;
  let changed = false;
  for (const [id, session] of companionSessions) {
    if ((session.updatedAt || session.createdAt) < cutoff) {
      companionSessions.delete(id);
      changed = true;
    }
  }
  if (changed) persistCompanionSessions();
}

loadCompanionSessions();

function renderCompanionPage(sessionId) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#1118f2">
<title>Intro Remote</title>
<style>
  :root {
    color-scheme: dark;
    --blue: #1118f2;
    --ink: #f8f8f2;
    --dim: rgba(248,248,242,.62);
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--blue); color: var(--ink); }
  body {
    min-height: 100svh;
    display: grid;
    place-items: center;
    padding: max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom));
    font-family: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  }
  main {
    width: min(100%, 440px);
    display: grid;
    gap: 24px;
  }
  [hidden] { display: none !important; }
  .panel { display: grid; gap: 24px; }
  .eyebrow {
    margin: 0;
    font-size: 11px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--dim);
  }
  h1 {
    margin: 0;
    max-width: 12ch;
    font-size: clamp(38px, 13vw, 72px);
    line-height: .92;
    letter-spacing: -.065em;
  }
  button {
    appearance: none;
    width: 100%;
    min-height: 88px;
    border: 2px solid var(--ink);
    border-radius: 0;
    background: var(--ink);
    color: var(--blue);
    font: 700 clamp(18px, 5vw, 24px)/1 ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
    letter-spacing: .08em;
    text-transform: uppercase;
    cursor: pointer;
    touch-action: manipulation;
  }
  button:active { transform: translateY(2px); }
  button:disabled { background: transparent; color: var(--ink); opacity: .72; }
  .name-input {
    width: 100%;
    min-height: 66px;
    padding: 12px 0;
    border: 0;
    border-bottom: 2px solid var(--ink);
    border-radius: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    font: 500 clamp(24px, 8vw, 42px)/1 ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
    letter-spacing: -.035em;
  }
  .name-input::placeholder { color: var(--dim); opacity: 1; }
  .channel-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .channel {
    min-height: 76px;
    padding: 12px 10px;
    background: transparent;
    color: var(--ink);
    font-size: clamp(13px, 3.8vw, 17px);
    line-height: 1.15;
    letter-spacing: .035em;
  }
  .channel:last-child { grid-column: 1 / -1; }
  .channel.is-active {
    background: var(--ink);
    color: var(--blue);
  }
  .camera-deck {
    display: grid;
    gap: 10px;
    padding-top: 4px;
  }
  .camera-deck .eyebrow { color: var(--ink); }
  .camera-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .camera {
    min-height: 54px;
    padding: 9px 8px;
    background: transparent;
    color: var(--ink);
    border-width: 1px;
    font-size: clamp(11px, 3.2vw, 14px);
    line-height: 1.15;
    letter-spacing: .03em;
  }
  .camera.is-active {
    background: var(--ink);
    color: var(--blue);
  }
  .reset {
    min-height: 48px;
    background: transparent;
    color: var(--ink);
    font-size: 12px;
    border-width: 1px;
  }
  .status {
    min-height: 1.4em;
    margin: 0;
    color: var(--dim);
    font-size: 12px;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
<main>
  <p class="eyebrow">Tawfeeq Martin · Companion 001</p>
  <form id="launchPanel" class="panel">
    <h1>What should I call you?</h1>
    <input id="visitorName" class="name-input" name="visitorName" type="text"
      maxlength="24" autocomplete="given-name" enterkeyhint="go"
      placeholder="First name" aria-label="Your first name">
    <button id="start" type="submit">Enter / run intro</button>
  </form>
  <section id="channelPanel" class="panel" hidden>
    <h1>Pick a channel.</h1>
    <div class="channel-grid" aria-label="Macintosh channels">
      <button class="channel" data-channel="help" type="button">01 · Help</button>
      <button class="channel" data-channel="blackbird" type="button">02 · Blackbird</button>
      <button class="channel" data-channel="louisvuitton" type="button">03 · Louis Vuitton</button>
      <button class="channel" data-channel="handofgod" type="button">04 · Hand of God</button>
      <button class="channel" data-channel="filmreel" type="button">05 · Film Reel</button>
    </div>
    <div class="camera-deck">
      <p class="eyebrow">Camera deck</p>
      <div class="camera-grid" aria-label="Stage cameras">
        <button class="camera" data-camera="wide" type="button">01 · Mouth Master · 60mm</button>
        <button class="camera" data-camera="hero" type="button">02 · Dead-on Hero · 100mm</button>
        <button class="camera" data-camera="floor" type="button">03 · Low Dolly · 71mm</button>
        <button class="camera" data-camera="left" type="button">04 · Left Three-quarter · 81mm</button>
        <button class="camera" data-camera="right" type="button">05 · Right Three-quarter · 81mm</button>
        <button class="camera" data-camera="crane" type="button">06 · Crane Establishing · 162mm</button>
      </div>
    </div>
    <button id="reset" class="reset" type="button">Stop / reset</button>
  </section>
  <p id="status" class="status">Connected · waiting for you</p>
</main>
<script>
const session = ${JSON.stringify(sessionId)};
const button = document.getElementById('start');
const visitorName = document.getElementById('visitorName');
const reset = document.getElementById('reset');
const status = document.getElementById('status');
const launchPanel = document.getElementById('launchPanel');
const channelPanel = document.getElementById('channelPanel');
const channelButtons = Array.from(document.querySelectorAll('[data-channel]'));
const cameraButtons = Array.from(document.querySelectorAll('[data-camera]'));
const REMOTE_LONG_POLL_SECONDS = 25;
const REMOTE_RETRY_MS = 3000;
  let syncTimer = 0;
  let syncInFlight = false;
  let syncController = null;
  let lastStateUpdatedAt = 0;
let running = false;
window.__resumeCompanionStatePolls = 0;

async function send(path, payload = {}) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session, ...payload }),
  });
  if (!response.ok) throw new Error('Command failed');
  return response.json();
}

function showMode(mode, activeChannel = '', activeCamera = 'hero') {
  const channels = mode === 'channels';
  launchPanel.hidden = channels;
  channelPanel.hidden = !channels;
  channelButtons.forEach((item) => {
    item.classList.toggle('is-active', item.dataset.channel === activeChannel);
  });
  cameraButtons.forEach((item) => {
    item.classList.toggle('is-active', item.dataset.camera === activeCamera);
  });
}

launchPanel.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = visitorName.value.trim().slice(0, 24);
  button.disabled = true;
  status.textContent = 'Sending…';
  try {
    await send('/api/companion/start', { visitorName: name });
    navigator.vibrate?.(35);
    running = true;
    button.textContent = 'Intro running';
    status.textContent = 'Running · waiting for intermission';
    button.disabled = false;
  } catch (_) {
    button.disabled = false;
    status.textContent = 'Could not reach the main screen · try again';
  }
});

channelButtons.forEach((item) => {
  item.addEventListener('click', async () => {
    channelButtons.forEach((candidate) => { candidate.disabled = true; });
    status.textContent = 'Tuning ' + item.textContent.replace(/^\\d+\\s*·\\s*/, '') + '…';
    try {
      await send('/api/companion/channel', { channel: item.dataset.channel });
      navigator.vibrate?.(25);
      channelButtons.forEach((candidate) => {
        candidate.classList.toggle('is-active', candidate === item);
        candidate.disabled = false;
      });
      status.textContent = item.textContent.replace(/^\\d+\\s*·\\s*/, '') + ' · live on Macintosh';
    } catch (_) {
      channelButtons.forEach((candidate) => { candidate.disabled = false; });
      status.textContent = 'Channel failed · try again';
    }
  });
});

cameraButtons.forEach((item) => {
  item.addEventListener('click', async () => {
    cameraButtons.forEach((candidate) => { candidate.disabled = true; });
    status.textContent = 'Moving to ' + item.textContent.replace(/^\\d+\\s*·\\s*/, '') + '…';
    try {
      await send('/api/companion/camera', { camera: item.dataset.camera });
      navigator.vibrate?.(18);
      cameraButtons.forEach((candidate) => {
        candidate.classList.toggle('is-active', candidate === item);
        candidate.disabled = false;
      });
      status.textContent = item.textContent.replace(/^\\d+\\s*·\\s*/, '') + ' · camera live';
    } catch (_) {
      cameraButtons.forEach((candidate) => { candidate.disabled = false; });
      status.textContent = 'Camera failed · try again';
    }
  });
});

reset.addEventListener('click', async () => {
  reset.disabled = true;
  try {
    await send('/api/companion/stop');
    running = false;
    button.textContent = 'Start intro';
    button.disabled = false;
    showMode('intro');
    status.textContent = 'Stopped · ready to run again';
  } catch (_) {
    status.textContent = 'Reset failed · try again';
  } finally {
    reset.disabled = false;
  }
});

async function syncState() {
  if (syncInFlight || document.hidden) return;
  syncInFlight = true;
  let delayMs = 0;
  try {
    window.__resumeCompanionStatePolls += 1;
    document.documentElement.dataset.companionStatePolls = String(window.__resumeCompanionStatePolls);
    syncController?.abort();
    const controller = new AbortController();
    syncController = controller;
    const response = await fetch('/api/companion/state?session=' + encodeURIComponent(session)
      + '&since=' + encodeURIComponent(lastStateUpdatedAt)
      + '&wait=' + REMOTE_LONG_POLL_SECONDS, {
      cache: 'no-store', signal: controller.signal,
    });
    if (syncController === controller) syncController = null;
    if (!response.ok) throw new Error('State failed');
    const payload = await response.json();
    lastStateUpdatedAt = Math.max(lastStateUpdatedAt, Number(payload.updatedAt) || 0);
    showMode(
      payload.displayMode || 'intro',
      payload.activeChannel || '',
      payload.activeCamera || 'hero',
    );
    if (payload.displayMode === 'channels') {
      const active = channelButtons.find((item) => item.dataset.channel === payload.activeChannel);
      status.textContent = active
        ? active.textContent.replace(/^\\d+\\s*·\\s*/, '') + ' · live on Macintosh'
        : 'Intermission · select the Macintosh monitor';
    } else if (payload.command === 'start') {
      running = true;
      button.textContent = 'Intro running';
      button.disabled = false;
      status.textContent = 'Running · waiting for intermission';
    } else {
      running = false;
      button.textContent = 'Start intro';
      button.disabled = false;
      status.textContent = 'Connected · waiting for you';
    }
  } catch (error) {
    if (error?.name === 'AbortError') return;
    status.textContent = 'Connection interrupted · retrying';
    delayMs = REMOTE_RETRY_MS;
  } finally {
    syncInFlight = false;
    window.clearTimeout(syncTimer);
    if (!document.hidden) syncTimer = window.setTimeout(syncState, delayMs);
  }
}

syncState();
document.addEventListener('visibilitychange', () => {
  syncController?.abort();
  syncController = null;
  window.clearTimeout(syncTimer);
  syncTimer = 0;
  if (!document.hidden) syncState();
});
</script>
</body>
</html>`;
}

async function handleCompanionRoute(req, res, url) {
  if (!url.pathname.startsWith('/api/companion') && url.pathname !== '/companion') return false;
  pruneCompanionSessions();

  if (url.pathname === '/api/companion/session') {
    if (req.method !== 'POST') {
      sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
      return true;
    }
    const requestPayload = await readJsonBody(req, 8 * 1024);
    const requestedId = String(requestPayload.session || '').trim();
    const reusableId = COMPANION_SESSION_ID_PATTERN.test(requestedId) ? requestedId : '';
    const id = reusableId || randomBytes(9).toString('base64url');
    const previous = companionSessions.get(id);
    const now = Date.now();
    companionSessions.set(id, createCompanionSession({
      createdAt: previous?.createdAt || now,
      updatedAt: now,
      revision: previous ? previous.revision + 1 : 0,
      startedAt: 0,
      // Reclaiming a session means the desktop has reloaded. Publish that
      // reset as authoritative state so an already-open phone controller
      // cannot remain stuck on "Intro running" or an old channel.
      command: previous ? 'stop' : 'waiting',
      displayMode: 'intro',
      activeChannel: '',
      activeCamera: 'hero',
    }));
    persistCompanionSessions();
    const origin = companionOrigin();
    sendJson(req, res, 200, {
      ok: true,
      instanceId: COMPANION_SERVER_INSTANCE,
      session: id,
      companionUrl: `${origin}/companion?session=${encodeURIComponent(id)}`,
      qrUrl: `/api/companion/qr.svg?session=${encodeURIComponent(id)}`,
    });
    return true;
  }

  const requestPayload = req.method === 'POST'
    ? await readJsonBody(req, 8 * 1024)
    : {};
  const sessionId = String(url.searchParams.get('session') || requestPayload.session || '').trim();
  let session = companionSessions.get(sessionId);
  // The random session ID is the reusable capability link. If runtime state
  // was lost (machine reboot, temp cleanup, or a new deployment instance),
  // rehydrate it in a safe stopped state so the existing phone URL can pair
  // again without a second QR scan.
  if (!session && COMPANION_SESSION_ID_PATTERN.test(sessionId)) {
    session = createCompanionSession({ command: 'stop' });
    companionSessions.set(sessionId, session);
    persistCompanionSessions();
  }

  if (url.pathname === '/api/companion/state') {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'GET, HEAD, OPTIONS' });
      return true;
    }
    if (!session) {
      sendJson(req, res, 404, { ok: false, error: 'Session expired.' });
      return true;
    }
    const since = Math.max(0, Number(url.searchParams.get('since')) || 0);
    const requestedWaitMs = Math.max(0, Number(url.searchParams.get('wait')) || 0) * 1000;
    const waitMs = req.method === 'HEAD'
      ? 0
      : Math.min(COMPANION_LONG_POLL_MAX_MS, requestedWaitMs);
    const deadline = Date.now() + waitMs;
    while (waitMs > 0
      && since > 0
      && session.updatedAt <= since
      && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(250, deadline - Date.now())));
      session = companionSessions.get(sessionId) || session;
    }
    sendJson(req, res, 200, {
      ok: true,
      instanceId: COMPANION_SERVER_INSTANCE,
      updatedAt: session.updatedAt,
      revision: session.revision,
      startedAt: session.startedAt,
      command: session.command,
      displayMode: session.displayMode,
      activeChannel: session.activeChannel,
      activeCamera: session.activeCamera,
      visitorName: session.visitorName,
    });
    return true;
  }

  if (url.pathname === '/api/companion/start' || url.pathname === '/api/companion/stop') {
    if (req.method !== 'POST') {
      sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
      return true;
    }
    if (!session) {
      sendJson(req, res, 404, { ok: false, error: 'Session expired.' });
      return true;
    }
    session.revision += 1;
    session.updatedAt = Date.now();
    session.command = url.pathname.endsWith('/stop') ? 'stop' : 'start';
    if (session.command === 'start') {
      session.visitorName = String(requestPayload.visitorName || '').trim().slice(0, 24);
    } else {
      session.visitorName = '';
    }
    session.startedAt = session.command === 'start' ? Date.now() : 0;
    session.displayMode = 'intro';
    session.activeChannel = '';
    session.activeCamera = 'hero';
    persistCompanionSessions();
    sendJson(req, res, 200, {
      ok: true,
      instanceId: COMPANION_SERVER_INSTANCE,
      revision: session.revision,
      startedAt: session.startedAt,
      command: session.command,
      displayMode: session.displayMode,
      activeChannel: session.activeChannel,
      activeCamera: session.activeCamera,
      visitorName: session.visitorName,
    });
    return true;
  }

  if (url.pathname === '/api/companion/display') {
    if (req.method !== 'POST') {
      sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
      return true;
    }
    if (!session) {
      sendJson(req, res, 404, { ok: false, error: 'Session expired.' });
      return true;
    }
    session.displayMode = requestPayload.mode === 'channels' ? 'channels' : 'intro';
    session.updatedAt = Date.now();
    if (session.displayMode !== 'channels') session.activeChannel = '';
    persistCompanionSessions();
    sendJson(req, res, 200, {
      ok: true,
      instanceId: COMPANION_SERVER_INSTANCE,
      displayMode: session.displayMode,
      activeChannel: session.activeChannel,
      activeCamera: session.activeCamera,
    });
    return true;
  }

  if (url.pathname === '/api/companion/channel') {
    if (req.method !== 'POST') {
      sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
      return true;
    }
    if (!session) {
      sendJson(req, res, 404, { ok: false, error: 'Session expired.' });
      return true;
    }
    const allowedChannels = new Set(['help', 'blackbird', 'louisvuitton', 'handofgod', 'filmreel']);
    const channel = String(requestPayload.channel || '').trim().toLowerCase();
    if (!allowedChannels.has(channel)) {
      sendJson(req, res, 400, { ok: false, error: 'Unknown channel.' });
      return true;
    }
    session.revision += 1;
    session.updatedAt = Date.now();
    session.command = 'channel';
    session.activeChannel = channel;
    persistCompanionSessions();
    sendJson(req, res, 200, {
      ok: true,
      instanceId: COMPANION_SERVER_INSTANCE,
      revision: session.revision,
      command: session.command,
      channel,
      displayMode: session.displayMode,
      activeCamera: session.activeCamera,
    });
    return true;
  }

  if (url.pathname === '/api/companion/camera') {
    if (req.method !== 'POST') {
      sendJson(req, res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'POST, OPTIONS' });
      return true;
    }
    if (!session) {
      sendJson(req, res, 404, { ok: false, error: 'Session expired.' });
      return true;
    }
    const allowedCameras = new Set(['wide', 'hero', 'floor', 'left', 'right', 'crane']);
    const camera = String(requestPayload.camera || '').trim().toLowerCase();
    if (!allowedCameras.has(camera)) {
      sendJson(req, res, 400, { ok: false, error: 'Unknown camera.' });
      return true;
    }
    session.revision += 1;
    session.updatedAt = Date.now();
    session.command = 'camera';
    session.activeCamera = camera;
    persistCompanionSessions();
    sendJson(req, res, 200, {
      ok: true,
      instanceId: COMPANION_SERVER_INSTANCE,
      revision: session.revision,
      command: session.command,
      camera,
      activeChannel: session.activeChannel,
      displayMode: session.displayMode,
    });
    return true;
  }

  if (url.pathname === '/api/companion/qr.svg') {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendSvg(req, res, 405, '');
      return true;
    }
    if (!session) {
      sendSvg(req, res, 404, '');
      return true;
    }
    const target = `${companionOrigin()}/companion?session=${encodeURIComponent(sessionId)}`;
    const svg = await QRCode.toString(target, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
    sendSvg(req, res, 200, svg);
    return true;
  }

  if (url.pathname === '/companion') {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendHtml(req, res, 405, 'Method not allowed');
      return true;
    }
    if (!session) {
      sendHtml(req, res, 404, '<!doctype html><meta name="viewport" content="width=device-width"><p>This companion session has expired. Refresh the main screen for a new QR code.</p>');
      return true;
    }
    sendHtml(req, res, 200, renderCompanionPage(sessionId));
    return true;
  }

  return false;
}

function resolveFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://${HOST}:${PORT}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  if (pathname === '/') pathname = '/Resume.html';
  const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.resolve(ROOT, `.${normalized}`);
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return filePath;
}

function parseRange(rangeHeader, size) {
  if (!rangeHeader) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) return { invalid: true };

  let start;
  let end;
  const [, rawStart, rawEnd] = match;

  if (rawStart === '' && rawEnd === '') return { invalid: true };
  if (rawStart === '') {
    const suffixLength = Number.parseInt(rawEnd, 10);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return { invalid: true };
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number.parseInt(rawStart, 10);
    end = rawEnd === '' ? size - 1 : Number.parseInt(rawEnd, 10);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return { invalid: true };
  }

  if (start < 0 || end < start || start >= size) return { invalid: true };
  return { start, end: Math.min(end, size - 1) };
}

function baseHeaders(filePath, size) {
  const extension = path.extname(filePath).toLowerCase();
  const cacheableAsset = ['.glb', '.gltf', '.png', '.jpg', '.jpeg', '.webp', '.woff', '.woff2'].includes(extension);
  return {
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Headers': 'Range',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Length, Content-Range',
    'Cache-Control': cacheableAsset ? 'public, max-age=3600' : 'no-store',
    'Content-Type': MIME_TYPES.get(extension) || 'application/octet-stream',
    'Vary': 'Range',
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, PATCH, PUT, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    });
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);
  if (await handleContactRoute(req, res, url)) return;
  if (await handleMacAsciiControlRoute(req, res, url)) return;
  if (await handleCompanionRoute(req, res, url)) return;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed\n', { Allow: 'GET, HEAD, OPTIONS' });
    return;
  }

  const filePath = resolveFilePath(req.url || '/');
  if (!filePath) {
    send(res, 400, 'Bad request\n');
    return;
  }

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    send(res, 404, 'Not found\n');
    return;
  }

  if (!stat.isFile()) {
    send(res, 404, 'Not found\n');
    return;
  }

  const size = stat.size;
  const headers = baseHeaders(filePath, size);
  const range = parseRange(req.headers.range, size);

  if (range?.invalid) {
    res.writeHead(416, {
      ...headers,
      'Content-Length': '0',
      'Content-Range': `bytes */${size}`,
    });
    res.end();
    return;
  }

  if (range) {
    const { start, end } = range;
    res.writeHead(206, {
      ...headers,
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    ...headers,
    'Content-Length': String(size),
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try: npm run serve -- ${PORT + 1}`);
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, HOST, () => {
  console.log(`Serving ${ROOT}`);
  console.log(`Open http://${HOST}:${PORT}/Resume.html`);
  if (HOST === '0.0.0.0' || HOST === '::') {
    console.log(`Wi-Fi preview ${companionOrigin()}/Resume.html`);
  }
  console.log('Range requests enabled for local media preview.');
});
