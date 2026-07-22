#!/usr/bin/env node

const [origin, assetVersion, commitHash, ...rest] = process.argv.slice(2);

const timeoutArg = rest.find((arg) => arg.startsWith('--timeout-ms='));
const timeoutMs = Number.parseInt(timeoutArg?.split('=')[1] || '90000', 10);
const pollMs = 4000;

if (!origin || !assetVersion || !commitHash) {
  console.error('Usage: node scripts/verify-pages-deploy.mjs <origin> <asset-version> <commit-hash> [--timeout-ms=90000]');
  process.exit(1);
}

const base = origin.replace(/\/+$/, '');
const expectedAssets = [
  `data.js?v=${assetVersion}`,
  `spotlight-bundle.js?v=${assetVersion}`,
  `dist/app.js?v=${assetVersion}`,
];
const forbiddenHtmlPatterns = [
  /help-720/i,
  /help_full\.mp4/i,
  /cloudflarestream/i,
  /videodelivery\.net/i,
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  return { response, text };
}

async function verifyOnce() {
  const cacheBust = `deploy-check=${Date.now()}`;
  const infoUrl = `${base}/deploy-info.json?${cacheBust}`;
  const infoResponse = await fetch(infoUrl, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
  if (!infoResponse.ok) {
    throw new Error(`deploy-info ${infoResponse.status}`);
  }
  const info = await infoResponse.json();
  if (info.commit !== commitHash) {
    throw new Error(`deploy-info commit mismatch: ${info.commit || '(missing)'}`);
  }
  if (info.assetVersion !== assetVersion) {
    throw new Error(`deploy-info asset version mismatch: ${info.assetVersion || '(missing)'}`);
  }

  const { response: htmlResponse, text: html } = await fetchText(`${base}/?${cacheBust}`);
  if (!htmlResponse.ok) throw new Error(`root HTML ${htmlResponse.status}`);
  if (!html.includes("RESUME_APP_VARIANT = 'landing-v1'")) {
    throw new Error('root HTML is not the interactive landing page');
  }
  if (html.includes('Principal Product Engineer / Creative Technologist')) {
    throw new Error('root HTML appears to be the flat resume page');
  }
  for (const asset of expectedAssets) {
    if (!html.includes(asset)) throw new Error(`root HTML missing ${asset}`);
  }
  for (const pattern of forbiddenHtmlPatterns) {
    if (pattern.test(html)) throw new Error(`root HTML includes forbidden HELP fallback: ${pattern}`);
  }

  const { response: resumeResponse, text: resumeHtml } = await fetchText(`${base}/Resume.html?${cacheBust}`);
  if (!resumeResponse.ok) throw new Error(`canonical resume HTML ${resumeResponse.status}`);
  if (!resumeHtml.includes('Principal Product Engineer / Creative Technologist')) {
    throw new Error('/Resume.html is not the flat resume page');
  }
  if (resumeHtml.includes("RESUME_APP_VARIANT = 'landing-v1'")) {
    throw new Error('/Resume.html is incorrectly serving the interactive landing page');
  }

  const enforcesCanonicalPublicRoutes = /(^|\.)tawfeeqmartin\.com$/i.test(new URL(base).hostname);
  if (enforcesCanonicalPublicRoutes) {
    const demoResponse = await fetch(`${base}/demo/Resume.html?${cacheBust}`, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    if (demoResponse.status !== 404) {
      throw new Error(`/demo/Resume.html should be gone; got ${demoResponse.status}`);
    }
  }

  const appResponse = await fetch(`${base}/dist/app.js?v=${assetVersion}`, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
  if (!appResponse.ok) throw new Error(`app bundle ${appResponse.status}`);
  const appText = await appResponse.text();
  if (appText.length < 100000) throw new Error(`app bundle too small: ${appText.length}`);

  const modelResponse = await fetch(`${base}/media/3d/apple_macintosh.glb`, { method: 'HEAD' });
  if (!modelResponse.ok) throw new Error(`Mac model ${modelResponse.status}`);

  const checkHelpRange = async (url, label) => {
    const helpResponse = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
    });
    const contentRange = helpResponse.headers.get('content-range') || '';
    const contentLength = helpResponse.headers.get('content-length') || '';
    if (helpResponse.status !== 206) {
      throw new Error(`HELP ${label} range status ${helpResponse.status}`);
    }
    if (!/^bytes 0-1023\/\d+/i.test(contentRange)) {
      throw new Error(`HELP ${label} range content-range mismatch: ${contentRange || '(missing)'}`);
    }
    if (contentLength !== '1024') {
      throw new Error(`HELP ${label} range content-length mismatch: ${contentLength || '(missing)'}`);
    }
    return contentRange;
  };

  const helpRange = await checkHelpRange(`${base}/media/help_full.webm`, 'canonical');
  try {
    await checkHelpRange(`${base}/media/help_full.webm?deploy-range-probe=1`, 'query-normalized');
  } catch (error) {
    console.warn(`warning: HELP query-normalized range probe failed: ${error.message || error}`);
  }

  return {
    origin: base,
    commit: info.commitShort || commitHash.slice(0, 7),
    assetVersion,
    helpRange,
  };
}

const deadline = Date.now() + timeoutMs;
let lastError = null;

while (Date.now() <= deadline) {
  try {
    const result = await verifyOnce();
    console.log(`verified ${result.origin} ${result.commit} ${result.assetVersion}`);
    console.log(`HELP range ${result.helpRange}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (Date.now() + pollMs > deadline) break;
    await wait(pollMs);
  }
}

console.error(`deploy verification failed for ${base}: ${lastError?.message || lastError}`);
process.exit(1);
