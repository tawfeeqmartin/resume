/**
 * spotlight-bundle.js — ES-module port of the spotlight TS sources.
 * Decodes Google Spotlight Stories MESH-projection WebM/MP4 into
 * a Three.js BufferGeometry and mounts a renderer onto a host element.
 *
 * Intentionally trimmed from the full app: stereo audio passthrough
 * only (no Omnitone FOA decode), no audio director / auto-cam — the
 * resume embed wants a clean drag-to-look hero, not a feature dump.
 *
 * Loaded as: import { mountSpotlight } from './spotlight-bundle.js';
 * Three.js comes from the unpkg ESM CDN.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ────────────────────────────────────────────────────────────────────
//  mp4Boxes — minimal ISO BMFF walker for sv3d → proj → mshp
// ────────────────────────────────────────────────────────────────────

function* iterBoxes(view, start, end) {
  let cursor = start;
  while (cursor + 8 <= end) {
    let size = view.getUint32(cursor);
    const type = readFourCC(view, cursor + 4);
    let payloadStart = cursor + 8;
    let totalLength = size;
    if (size === 1) {
      const sizeHi = view.getUint32(cursor + 8);
      const sizeLo = view.getUint32(cursor + 12);
      size = sizeHi * 0x100000000 + sizeLo;
      totalLength = size;
      payloadStart = cursor + 16;
    } else if (size === 0) {
      totalLength = end - cursor;
    }
    if (totalLength < 8 || cursor + totalLength > end) return;
    yield {
      type,
      start: cursor,
      payloadStart,
      payloadLength: totalLength - (payloadStart - cursor),
      totalLength
    };
    cursor += totalLength;
  }
}

const CONTAINER_BOXES = new Set([
  'moov','trak','mdia','minf','stbl','stsd','sv3d','proj','mshp',
  'edts','udta','meta','moof','traf','mvex'
]);
const VISUAL_SAMPLE_ENTRIES = new Set([
  'avc1','avc3','hev1','hvc1','vp08','vp09','av01','mp4v'
]);

function findAllBoxes(buf, type, start = 0, end = buf.byteLength) {
  const out = [];
  const view = new DataView(buf);
  scan(view, start, end, type, out);
  return out;
}

function scan(view, start, end, needle, out) {
  for (const box of iterBoxes(view, start, end)) {
    if (box.type === needle) out.push(box);
    if (CONTAINER_BOXES.has(box.type)) {
      const innerStart = box.type === 'stsd' ? box.payloadStart + 8 : box.payloadStart;
      scan(view, innerStart, box.payloadStart + box.payloadLength, needle, out);
    }
    if (VISUAL_SAMPLE_ENTRIES.has(box.type)) {
      const innerStart = box.payloadStart + 78;
      if (innerStart < box.payloadStart + box.payloadLength) {
        scan(view, innerStart, box.payloadStart + box.payloadLength, needle, out);
      }
    }
  }
}

function readFourCC(view, offset) {
  return (
    String.fromCharCode(view.getUint8(offset)) +
    String.fromCharCode(view.getUint8(offset + 1)) +
    String.fromCharCode(view.getUint8(offset + 2)) +
    String.fromCharCode(view.getUint8(offset + 3))
  );
}

function readProjection(buf, sv3d) {
  const view = new DataView(buf);
  const sv3dEnd = sv3d.payloadStart + sv3d.payloadLength;
  for (const child of iterBoxes(view, sv3d.payloadStart, sv3dEnd)) {
    if (child.type !== 'proj') continue;
    const projEnd = child.payloadStart + child.payloadLength;
    for (const proj of iterBoxes(view, child.payloadStart, projEnd)) {
      if (proj.type === 'equi' || proj.type === 'cbmp' || proj.type === 'mshp') {
        return { type: proj.type, payloadStart: proj.payloadStart, payloadLength: proj.payloadLength };
      }
    }
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────
//  webmProjection — extract Matroska ProjectionPrivate
// ────────────────────────────────────────────────────────────────────

function extractWebmProjection(buf) {
  const view = new Uint8Array(buf);
  if (view.length < 4 || view[0] !== 0x1a || view[1] !== 0x45 || view[2] !== 0xdf || view[3] !== 0xa3) {
    return null;
  }
  const scanLimit = Math.min(view.length, 5 * 1024 * 1024);
  let projOffset = -1;
  for (let i = 0; i < scanLimit - 1; i++) {
    if (view[i] === 0x76 && view[i + 1] === 0x70) {
      if (view[i + 2] !== 0) { projOffset = i; break; }
    }
  }
  if (projOffset < 0) return null;
  let cursor = projOffset + 2;
  const sz = readVint(view, cursor);
  cursor += sz.bytes;
  const projEnd = cursor + sz.value;
  let type = -1;
  let projectionPrivate = null;
  while (cursor < projEnd && cursor < view.length) {
    if (cursor + 2 >= view.length) break;
    const idHi = view[cursor];
    const idLo = view[cursor + 1];
    cursor += 2;
    const childSz = readVint(view, cursor);
    cursor += childSz.bytes;
    const dataStart = cursor;
    const dataEnd = cursor + childSz.value;
    if (dataEnd > view.length) break;
    if (idHi === 0x76 && idLo === 0x71) {
      type = readUintBE(view, dataStart, childSz.value);
    } else if (idHi === 0x76 && idLo === 0x72) {
      projectionPrivate = view.slice(dataStart, dataEnd);
    }
    cursor = dataEnd;
  }
  return { type, projectionPrivate };
}

function readVint(buf, off) {
  const first = buf[off];
  if (first === 0) throw new Error('zero-length VINT');
  let len = 1, mask = 0x80;
  while ((first & mask) === 0) {
    len++; mask >>= 1;
    if (mask === 0) throw new Error('invalid VINT');
  }
  let value = first & (mask - 1);
  for (let i = 1; i < len; i++) value = value * 256 + buf[off + i];
  return { value, bytes: len };
}

function readUintBE(buf, off, len) {
  let v = 0;
  for (let i = 0; i < len; i++) v = v * 256 + buf[off + i];
  return v;
}

// ────────────────────────────────────────────────────────────────────
//  meshParser — decode MESH projection → THREE.BufferGeometry
// ────────────────────────────────────────────────────────────────────

async function parseMshpPayload(payload) {
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  let cursor = 4;
  cursor += 4; // crc
  const encoding = readFourCC(view, cursor);
  cursor += 4;
  const tail = payload.subarray(cursor);
  let inflated;
  if (encoding === 'dfl8') {
    inflated = await inflateRaw(tail);
  } else if (encoding === 'raw\0') {
    inflated = tail.slice();
  } else {
    throw new Error(`unknown mshp encoding "${encoding}"`);
  }

  const inflatedView = new DataView(inflated.buffer, inflated.byteOffset, inflated.byteLength);
  const meshes = [];
  for (const box of iterBoxes(inflatedView, 0, inflated.byteLength)) {
    if (box.type === 'mesh') meshes.push(box);
  }
  if (meshes.length === 0) throw new Error('mshp had no mesh sub-boxes');

  const positions = [], uvs = [], indices = [];
  let vertexBase = 0;
  for (const mesh of meshes) {
    decodeMesh(inflated, mesh, positions, uvs, indices, vertexBase);
    vertexBase = positions.length / 3;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  if (indices.length > 0) {
    geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  }
  geometry.computeBoundingSphere();
  return { geometry, vertexCount: positions.length / 3, meshCount: meshes.length };
}

async function parseMshp(buf, payloadStart, payloadLength) {
  const slice = new Uint8Array(buf, payloadStart, payloadLength);
  return parseMshpPayload(slice);
}

function decodeMesh(inflated, mesh, positions, uvs, indices, vertexBase) {
  const view = new DataView(inflated.buffer, inflated.byteOffset + mesh.payloadStart, mesh.payloadLength);
  let off = 0;
  const coordCount = view.getUint32(off); off += 4;
  const coords = new Float32Array(coordCount);
  for (let i = 0; i < coordCount; i++) { coords[i] = view.getFloat32(off); off += 4; }
  const vertexCount = view.getUint32(off); off += 4;
  const ccsb = ceilLog2(coordCount * 2);
  const reader = new BitReader(view, off * 8);
  const prev = [0,0,0,0,0];
  const vertCoordIdx = new Int32Array(vertexCount * 5);
  for (let i = 0; i < vertexCount; i++) {
    for (let c = 0; c < 5; c++) {
      const delta = reader.read(ccsb);
      const decoded = zigzag(delta);
      const idx = prev[c] + decoded;
      prev[c] = idx;
      vertCoordIdx[i * 5 + c] = idx;
    }
  }
  for (let i = 0; i < vertexCount; i++) {
    const xi = vertCoordIdx[i*5+0], yi = vertCoordIdx[i*5+1], zi = vertCoordIdx[i*5+2];
    const ui = vertCoordIdx[i*5+3], vi = vertCoordIdx[i*5+4];
    positions.push(coords[xi], coords[yi], coords[zi]);
    uvs.push(coords[ui], coords[vi]);
  }
  reader.alignToByte();
  let vlCursor = reader.byteOffset;
  const vertexListCount = view.getUint32(vlCursor); vlCursor += 4;
  const vcsb = ceilLog2(vertexCount * 2);
  for (let l = 0; l < vertexListCount; l++) {
    vlCursor += 1; // textureId
    const indexType = view.getUint8(vlCursor); vlCursor += 1;
    const indexCount = view.getUint32(vlCursor); vlCursor += 4;
    const idxReader = new BitReader(view, vlCursor * 8);
    let prevIdx = 0;
    const localIndices = new Int32Array(indexCount);
    for (let i = 0; i < indexCount; i++) {
      const delta = idxReader.read(vcsb);
      const decoded = zigzag(delta);
      prevIdx += decoded;
      localIndices[i] = prevIdx;
    }
    idxReader.alignToByte();
    vlCursor = idxReader.byteOffset;
    if (indexType === 0) {
      for (let i = 0; i < indexCount; i++) indices.push(localIndices[i] + vertexBase);
    } else if (indexType === 1) {
      for (let i = 0; i < indexCount - 2; i++) {
        const a = localIndices[i], b = localIndices[i+1], c = localIndices[i+2];
        if (i % 2 === 0) indices.push(a + vertexBase, b + vertexBase, c + vertexBase);
        else indices.push(b + vertexBase, a + vertexBase, c + vertexBase);
      }
    } else if (indexType === 2) {
      const first = localIndices[0];
      for (let i = 1; i < indexCount - 1; i++) {
        indices.push(first + vertexBase, localIndices[i] + vertexBase, localIndices[i+1] + vertexBase);
      }
    } else throw new Error(`unknown index_type ${indexType}`);
  }
}

function ceilLog2(n) { return n <= 1 ? 1 : Math.ceil(Math.log2(n)); }
function zigzag(n) { return (n >>> 1) ^ -(n & 1); }

async function inflateRaw(input) {
  const blob = new Blob([input]);
  const stream = blob.stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

class BitReader {
  constructor(view, startBit) { this.view = view; this.bitPos = startBit; }
  read(bits) {
    let v = 0;
    for (let i = 0; i < bits; i++) {
      const byte = this.view.getUint8(this.bitPos >>> 3);
      const bit = (byte >> (7 - (this.bitPos & 7))) & 1;
      v = (v << 1) | bit;
      this.bitPos++;
    }
    return v;
  }
  alignToByte() { this.bitPos = (this.bitPos + 7) & ~7; }
  get byteOffset() { return this.bitPos >>> 3; }
}

// ────────────────────────────────────────────────────────────────────
//  loader — fetch URL → geometry + video element
// ────────────────────────────────────────────────────────────────────

function makeEquirectSphere() {
  const geo = new THREE.SphereGeometry(500, 64, 32);
  geo.scale(-1, 1, 1);
  return geo;
}

async function fetchProjectionBytes(url) {
  const res = await fetch(url, { headers: { Range: 'bytes=0-5242879' } });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.arrayBuffer();
}

async function loadFromUrl(url) {
  const buf = await fetchProjectionBytes(url);
  const head = new Uint8Array(buf, 0, Math.min(16, buf.byteLength));
  const isWebm = head.length >= 4 && head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3;

  let geometry, projection;
  if (isWebm) {
    const proj = extractWebmProjection(buf);
    if (proj && proj.type === 3 && proj.projectionPrivate) {
      const parsed = await parseMshpPayload(proj.projectionPrivate);
      parsed.geometry.scale(100, 100, 100);
      geometry = parsed.geometry;
      projection = 'mesh';
    } else {
      geometry = makeEquirectSphere();
      projection = 'equirect';
    }
  } else {
    const sv3dBoxes = findAllBoxes(buf, 'sv3d');
    if (sv3dBoxes.length > 0) {
      const proj = readProjection(buf, sv3dBoxes[0]);
      if (proj && proj.type === 'mshp') {
        const parsed = await parseMshp(buf, proj.payloadStart, proj.payloadLength);
        geometry = parsed.geometry;
        projection = 'mesh';
      } else {
        geometry = makeEquirectSphere();
        projection = 'equirect';
      }
    } else {
      geometry = makeEquirectSphere();
      projection = 'equirect';
    }
  }

  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.src = url;
  video.loop = true;
  video.playsInline = true;
  video.muted = true;
  video.preload = 'metadata';
  video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;';
  document.body.appendChild(video);

  return { geometry, projection, video, dispose: () => { video.removeAttribute('src'); video.load(); video.remove(); } };
}

// ────────────────────────────────────────────────────────────────────
//  Renderer — drag-to-look sphere viewer
// ────────────────────────────────────────────────────────────────────

class SpotlightRenderer {
  constructor(host) {
    this.host = host;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, host.clientWidth / host.clientHeight, 0.1, 1100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(host.clientWidth, host.clientHeight, false);
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;cursor:grab;';
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute('aria-label', 'Interactive 360 video viewer');
    this.yaw = 0;
    this.pitch = 0;
    this.dragging = false;
    this.lastX = 0; this.lastY = 0;
    this.autoSpin = true;
    this.keys = new Set();
    this.current = null;
    this.resizeObserver = null;
    this.onStateChange = null;

    this._onResize = this._onResize.bind(this);
    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._tick = this._tick.bind(this);

    window.addEventListener('resize', this._onResize);
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this._onResize);
      this.resizeObserver.observe(host);
    }
    this.renderer.domElement.addEventListener('pointerdown', this._onDown);
    window.addEventListener('pointermove', this._onMove);
    window.addEventListener('pointerup', this._onUp);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    this._lastTime = performance.now();
    requestAnimationFrame(this._tick);
  }

  attach(loaded) {
    if (this.current) {
      this.scene.remove(this.current.mesh);
      this.current.mesh.geometry.dispose();
      this.current.texture.dispose();
      this.current.mesh.material.dispose();
      this.current.loaded.dispose();
    }
    const tex = new THREE.VideoTexture(loaded.video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(loaded.geometry, mat);
    this.scene.add(mesh);
    this.current = { mesh, texture: tex, loaded };
    // Try silent autoplay — we already set muted=true so this should pass the autoplay gate.
    loaded.video.play().catch(err => console.warn('[spotlight] autoplay blocked:', err));
  }

  setAutoSpin(v) { this.autoSpin = v; }
  unmute() {
    if (this.current) {
      this.current.loaded.video.muted = false;
      this.current.loaded.video.play().catch(()=>{});
    }
  }
  setStateCallback(cb) {
    this.onStateChange = cb;
    this._emitState();
  }
  play() {
    if (!this.current) return;
    this.current.loaded.video.play().catch(()=>{});
  }
  pause() {
    if (!this.current) return;
    this.current.loaded.video.pause();
  }
  replayWithSound() {
    if (!this.current) return;
    const video = this.current.loaded.video;
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(()=>{});
  }
  toggleMuted() {
    if (!this.current) return;
    const video = this.current.loaded.video;
    video.muted = !video.muted;
    if (video.paused) video.play().catch(()=>{});
  }
  getState() {
    const video = this.current?.loaded.video;
    return {
      muted: video ? video.muted : true,
      paused: video ? video.paused : true,
      ready: !!video
    };
  }
  _emitState() {
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  _tick() {
    requestAnimationFrame(this._tick);
    const now = performance.now();
    const dt = (now - this._lastTime) / 1000;
    this._lastTime = now;
    if (this.keys.size > 0) {
      const speed = this.keys.has('shift') ? 2.2 : 1.15;
      const step = speed * dt;
      if (this.keys.has('a') || this.keys.has('arrowleft')) this.yaw += step;
      if (this.keys.has('d') || this.keys.has('arrowright')) this.yaw -= step;
      if (this.keys.has('w') || this.keys.has('arrowup')) this.pitch += step;
      if (this.keys.has('s')) this.pitch -= step;
      const limit = Math.PI / 2 - 0.01;
      this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
      this.autoSpin = false;
    }
    if (this.autoSpin && !this.dragging) {
      this.yaw += dt * 0.06;
    }
    const limit = Math.PI / 2 - 0.01;
    const renderPitch = Math.max(-limit, Math.min(limit, this.pitch));
    const dir = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(renderPitch),
      Math.sin(renderPitch),
      Math.cos(this.yaw) * Math.cos(renderPitch)
    );
    this.camera.lookAt(dir);
    if (this.current) {
      const v = this.current.loaded.video;
      if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        this.current.texture.needsUpdate = true;
      }
    }
    this.renderer.render(this.scene, this.camera);
    this._emitState();
  }

  _onResize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  _onDown(e) {
    this.dragging = true;
    this.lastX = e.clientX; this.lastY = e.clientY;
    this.autoSpin = false;
    this.renderer.domElement.focus({ preventScroll: true });
    this.renderer.domElement.style.cursor = 'grabbing';
  }
  _onMove(e) {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX, dy = e.clientY - this.lastY;
    this.lastX = e.clientX; this.lastY = e.clientY;
    this.yaw -= (dx / this.host.clientWidth) * Math.PI;
    this.pitch -= (dy / this.host.clientHeight) * (Math.PI / 2);
    const limit = Math.PI / 2 - 0.01;
    this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
  }
  _onUp() {
    this.dragging = false;
    this.renderer.domElement.style.cursor = 'grab';
  }
  _onKeyDown(e) {
    const target = e.target;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    const key = e.key.toLowerCase();
    if (key === 'shift') {
      this.keys.add('shift');
      return;
    }
    if (key === ' ') {
      if (this.current) {
        const video = this.current.loaded.video;
        if (video.paused) this.play();
        else this.pause();
      }
      e.preventDefault();
      return;
    }
    if (key === 'arrowdown') {
      this.yaw += Math.PI;
      this.autoSpin = false;
      e.preventDefault();
      return;
    }
    if (key === 'a' || key === 'd' || key === 'w' || key === 's' || key === 'arrowleft' || key === 'arrowright' || key === 'arrowup') {
      this.keys.add(key);
      this.autoSpin = false;
      e.preventDefault();
    } else {
      return;
    }
  }
  _onKeyUp(e) {
    this.keys.delete(e.key.toLowerCase());
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerup', this._onUp);
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.current) this.current.loaded.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

// ────────────────────────────────────────────────────────────────────
//  Public API
// ────────────────────────────────────────────────────────────────────

export async function mountSpotlight(host, url) {
  const r = new SpotlightRenderer(host);
  try {
    const loaded = await loadFromUrl(url);
    r.attach(loaded);
    return { renderer: r, projection: loaded.projection };
  } catch (err) {
    r.dispose();
    throw err;
  }
}
