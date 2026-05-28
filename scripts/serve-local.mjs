#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number.parseInt(process.argv[2] || process.env.PORT || '8021', 10);
const HOST = process.env.HOST || '127.0.0.1';

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

function send(res, status, body, extraHeaders = {}) {
  const payload = Buffer.from(body);
  res.writeHead(status, {
    'Content-Length': payload.byteLength,
    'Content-Type': 'text/plain; charset=utf-8',
    ...extraHeaders,
  });
  res.end(payload);
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
  return {
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Headers': 'Range',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Length, Content-Range',
    'Cache-Control': 'no-store',
    'Content-Type': MIME_TYPES.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
    'Vary': 'Range',
  };
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    });
    res.end();
    return;
  }

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
  console.log('Range requests enabled for local media preview.');
});
