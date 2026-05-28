#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const [
  stageDir,
  assetVersion,
  commitHash,
  commitShort,
  branch = 'main',
] = process.argv.slice(2);

if (!stageDir || !assetVersion || !commitHash || !commitShort) {
  console.error('Usage: node scripts/prepare-pages-deploy.mjs <stage-dir> <asset-version> <commit-hash> <commit-short> [branch]');
  process.exit(1);
}

const REQUIRED_FILES = [
  'Resume.html',
  'index.html',
  'data.js',
  'spotlight-bundle.js',
  'dist/app.js',
  '_worker.js',
  'media/3d/apple_macintosh.glb',
  'media/demo/mac4.jpg',
];

const FORBIDDEN_STAGE_FILES = [
  'media/help_full.webm',
  'media/help-720-mesh.webm',
  'media/help_full.mp4',
  'media/bg.mov',
];

const HELP_FORBIDDEN_PATTERNS = [
  /help-720/i,
  /help_full\.mp4/i,
  /cloudflarestream/i,
  /videodelivery\.net/i,
];

const VERSIONED_ASSETS = [
  { label: 'data.js', regex: /(data\.js\?v=)[^"')]+/g },
  { label: 'spotlight-bundle.js', regex: /(spotlight-bundle\.js\?v=)[^"')]+/g },
  { label: 'dist/app.js', regex: /(dist\/app\.js\?v=)[^"')]+/g },
];

function posixPath(file) {
  return file.split(path.sep).join('/');
}

async function assertFileExists(file) {
  const filePath = path.join(stageDir, file);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat?.isFile()) {
    throw new Error(`Missing required deploy file: ${file}`);
  }
}

async function assertFileAbsent(file) {
  const filePath = path.join(stageDir, file);
  const stat = await fs.stat(filePath).catch(() => null);
  if (stat) {
    throw new Error(`Forbidden file staged for Pages deploy: ${file}`);
  }
}

async function hashFile(file) {
  const data = await fs.readFile(path.join(stageDir, file));
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function rewriteHtmlAssetVersions(file) {
  const filePath = path.join(stageDir, file);
  let html = await fs.readFile(filePath, 'utf8');

  for (const pattern of HELP_FORBIDDEN_PATTERNS) {
    if (pattern.test(html)) {
      throw new Error(`${file} references a forbidden HELP fallback/path: ${pattern}`);
    }
  }

  for (const asset of VERSIONED_ASSETS) {
    let count = 0;
    html = html.replace(asset.regex, (_, prefix) => {
      count += 1;
      return `${prefix}${assetVersion}`;
    });
    if (count !== 1) {
      throw new Error(`${file} should reference ${asset.label} exactly once; found ${count}.`);
    }
  }

  await fs.writeFile(filePath, html);
}

await fs.access(stageDir);

for (const file of REQUIRED_FILES) {
  await assertFileExists(file);
}

for (const file of FORBIDDEN_STAGE_FILES) {
  await assertFileAbsent(file);
}

await rewriteHtmlAssetVersions('Resume.html');
await rewriteHtmlAssetVersions('index.html');

const files = {
  data: 'data.js',
  spotlight: 'spotlight-bundle.js',
  app: 'dist/app.js',
  worker: '_worker.js',
  macModel: 'media/3d/apple_macintosh.glb',
};

const deployInfo = {
  project: 'resume',
  branch,
  commit: commitHash,
  commitShort,
  assetVersion,
  builtAt: new Date().toISOString(),
  entrypoints: {
    data: `data.js?v=${assetVersion}`,
    spotlight: `spotlight-bundle.js?v=${assetVersion}`,
    app: `dist/app.js?v=${assetVersion}`,
  },
  helpMedia: {
    path: '/media/help_full.webm',
    policy: 'same-origin original full WebM only; no 720p, MP4, Stream, or transcode fallback',
  },
  files: Object.fromEntries(await Promise.all(
    Object.entries(files).map(async ([key, file]) => [
      key,
      {
        path: posixPath(file),
        sha256: await hashFile(file),
      },
    ]),
  )),
};

await fs.writeFile(
  path.join(stageDir, 'deploy-info.json'),
  `${JSON.stringify(deployInfo, null, 2)}\n`,
);

console.log(`prepared Pages deploy metadata for ${commitShort} (${assetVersion})`);
