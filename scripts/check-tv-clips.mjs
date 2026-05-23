import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const APP_PATH = path.join(ROOT, 'app.jsx');
const LOCAL_CLIP_DIR = path.join(ROOT, 'media', 'tv-clips');
const LOCAL_ONLY = process.argv.includes('--local-only');
const CONCURRENCY = 8;

function unique(values) {
  return [...new Set(values)];
}

function extractConstString(source, name, fallback = '') {
  const match = source.match(new RegExp(`const ${name} = ['"]([^'"]+)['"]`));
  return match?.[1] || fallback;
}

function extractTrailerGroups(source) {
  const match = source.match(/const CLEARED_TRAILER_GROUPS = ([\s\S]*?);\n\/\/ Sources/);
  if (!match) {
    throw new Error('Could not find CLEARED_TRAILER_GROUPS in app.jsx.');
  }
  return Function(`return (${match[1]});`)();
}

function expandClipFiles(groups) {
  const files = [];
  for (const group of groups) {
    const skipped = new Set(group.skip || []);
    const takes = Array.isArray(group.takes)
      ? group.takes
      : Array.from({ length: group.takes || 4 }, (_, index) => index + 1);
    for (const takeId of takes) {
      if (skipped.has(takeId)) continue;
      const take = String(takeId).padStart(2, '0');
      files.push(`cleared-${group.slug}-${take}.mp4`);
    }
  }
  return unique(files);
}

async function existsLocal(file) {
  try {
    await fs.access(path.join(LOCAL_CLIP_DIR, file));
    return true;
  } catch (_) {
    return false;
  }
}

async function checkRemote(files, origin, cacheKey) {
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < files.length) {
      const file = files[cursor++];
      const url = `${origin}/tv-clips/${file}?v=${cacheKey}`;
      try {
        const response = await fetch(url, { method: 'HEAD' });
        results.push({
          file,
          status: response.status,
          ranges: response.headers.get('accept-ranges') || '',
          cache: response.headers.get('cache-control') || '',
        });
      } catch (error) {
        results.push({ file, status: 'ERR', error: error.message, ranges: '', cache: '' });
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results.sort((a, b) => a.file.localeCompare(b.file));
}

const source = await fs.readFile(APP_PATH, 'utf8');
const origin = extractConstString(source, 'PRODUCTION_MEDIA_ORIGIN', 'https://media.tawfeeqmartin.com');
const cacheKey = extractConstString(source, 'TV_CLIP_CACHE_KEY', 'dev');
const files = expandClipFiles(extractTrailerGroups(source));
const localMissing = [];

for (const file of files) {
  if (!(await existsLocal(file))) localMissing.push(file);
}

console.log(`active TV clips: ${files.length}`);
console.log(`local missing: ${localMissing.length}`);
for (const file of localMissing) console.log(`local 404 ${file}`);

let remoteMissing = [];
let noRanges = [];
let noImmutableCache = [];

if (!LOCAL_ONLY) {
  const remote = await checkRemote(files, origin, cacheKey);
  remoteMissing = remote.filter((result) => result.status !== 200);
  noRanges = remote.filter((result) => result.status === 200 && !/bytes/i.test(result.ranges));
  noImmutableCache = remote.filter((result) => result.status === 200 && !/immutable/i.test(result.cache));

  console.log(`remote missing/bad: ${remoteMissing.length}`);
  for (const result of remoteMissing) console.log(`remote ${result.status} ${result.file}`);
  console.log(`remote missing byte ranges: ${noRanges.length}`);
  for (const result of noRanges) console.log(`no range ${result.file}`);
  console.log(`remote missing immutable cache: ${noImmutableCache.length}`);
  for (const result of noImmutableCache) console.log(`no immutable cache ${result.file}`);
}

if (localMissing.length || remoteMissing.length || noRanges.length || noImmutableCache.length) {
  process.exitCode = 1;
}
