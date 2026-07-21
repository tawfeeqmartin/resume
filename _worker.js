const MEDIA_ORIGIN = 'https://media.tawfeeqmartin.com';
const SAME_ORIGIN_MEDIA = new Set([
  '/media/help_full.webm',
]);
const COMPANION_SESSION_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const COMPANION_INSTANCE = 'cloudflare-cache-v1';
const COMPANION_TTL_SECONDS = 24 * 60 * 60;

function companionJson(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function companionSessionId() {
  return crypto.randomUUID().replaceAll('-', '').slice(0, 20);
}

function companionCacheKey(url, session) {
  return new Request(`${url.origin}/__companion_state/${encodeURIComponent(session)}`);
}

function newCompanionState(overrides = {}) {
  const now = Date.now();
  return {
    createdAt: now,
    updatedAt: now,
    revision: 0,
    startedAt: 0,
    command: 'waiting',
    displayMode: 'intro',
    activeChannel: '',
    activeCamera: 'hero',
    visitorName: '',
    ...overrides,
  };
}

async function readCompanionState(url, session) {
  if (!COMPANION_SESSION_PATTERN.test(session)) return null;
  const response = await caches.default.match(companionCacheKey(url, session));
  if (!response) return null;
  return response.json().catch(() => null);
}

async function writeCompanionState(url, session, state) {
  state.updatedAt = Date.now();
  await caches.default.put(
    companionCacheKey(url, session),
    new Response(JSON.stringify(state), {
      headers: {
        'Cache-Control': `public, max-age=${COMPANION_TTL_SECONDS}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }),
  );
  return state;
}

async function companionPayload(request) {
  if (request.method !== 'POST') return {};
  return request.json().catch(() => ({}));
}

async function handleCompanionRequest(request, url) {
  if (!url.pathname.startsWith('/api/companion/')) return null;
  const payload = await companionPayload(request);

  if (url.pathname === '/api/companion/session') {
    if (request.method !== 'POST') {
      return companionJson({ ok: false, error: 'Method not allowed.' }, 405);
    }
    const requested = String(payload.session || '').trim();
    const session = COMPANION_SESSION_PATTERN.test(requested)
      ? requested
      : companionSessionId();
    const previous = await readCompanionState(url, session);
    const state = newCompanionState({
      createdAt: previous?.createdAt || Date.now(),
      revision: previous ? (Number(previous.revision) || 0) + 1 : 0,
      command: previous ? 'stop' : 'waiting',
    });
    await writeCompanionState(url, session, state);
    return companionJson({
      ok: true,
      instanceId: COMPANION_INSTANCE,
      session,
      companionUrl: `${url.origin}/companion.html?session=${encodeURIComponent(session)}`,
      // The main bundle generates this QR locally, avoiding a third-party QR
      // service and keeping the capability URL private.
      qrUrl: '',
    });
  }

  const session = String(url.searchParams.get('session') || payload.session || '').trim();
  if (!COMPANION_SESSION_PATTERN.test(session)) {
    return companionJson({ ok: false, error: 'Invalid session.' }, 400);
  }
  let state = await readCompanionState(url, session);
  if (!state) {
    state = newCompanionState({ command: 'stop' });
    await writeCompanionState(url, session, state);
  }

  if (url.pathname === '/api/companion/state') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return companionJson({ ok: false, error: 'Method not allowed.' }, 405);
    }
    return companionJson({
      ok: true,
      instanceId: COMPANION_INSTANCE,
      revision: Number(state.revision) || 0,
      startedAt: Number(state.startedAt) || 0,
      command: state.command || 'stop',
      displayMode: state.displayMode || 'intro',
      activeChannel: state.activeChannel || '',
      activeCamera: state.activeCamera || 'hero',
      visitorName: state.visitorName || '',
    });
  }

  if (url.pathname === '/api/companion/start' || url.pathname === '/api/companion/stop') {
    if (request.method !== 'POST') {
      return companionJson({ ok: false, error: 'Method not allowed.' }, 405);
    }
    state.revision = (Number(state.revision) || 0) + 1;
    state.command = url.pathname.endsWith('/stop') ? 'stop' : 'start';
    state.startedAt = state.command === 'start' ? Date.now() : 0;
    state.visitorName = state.command === 'start'
      ? String(payload.visitorName || '').trim().slice(0, 24)
      : '';
    state.displayMode = 'intro';
    state.activeChannel = '';
    state.activeCamera = 'hero';
    await writeCompanionState(url, session, state);
    return companionJson({ ok: true, instanceId: COMPANION_INSTANCE, ...state });
  }

  if (url.pathname === '/api/companion/display') {
    if (request.method !== 'POST') {
      return companionJson({ ok: false, error: 'Method not allowed.' }, 405);
    }
    state.displayMode = payload.mode === 'channels' ? 'channels' : 'intro';
    if (state.displayMode !== 'channels') state.activeChannel = '';
    await writeCompanionState(url, session, state);
    return companionJson({ ok: true, instanceId: COMPANION_INSTANCE, ...state });
  }

  if (url.pathname === '/api/companion/channel') {
    if (request.method !== 'POST') {
      return companionJson({ ok: false, error: 'Method not allowed.' }, 405);
    }
    const channel = String(payload.channel || '').trim().toLowerCase();
    if (!new Set(['help', 'blackbird', 'louisvuitton', 'handofgod', 'filmreel']).has(channel)) {
      return companionJson({ ok: false, error: 'Unknown channel.' }, 400);
    }
    state.revision = (Number(state.revision) || 0) + 1;
    state.command = 'channel';
    state.activeChannel = channel;
    await writeCompanionState(url, session, state);
    return companionJson({ ok: true, instanceId: COMPANION_INSTANCE, ...state });
  }

  if (url.pathname === '/api/companion/camera') {
    if (request.method !== 'POST') {
      return companionJson({ ok: false, error: 'Method not allowed.' }, 405);
    }
    const camera = String(payload.camera || '').trim().toLowerCase();
    if (!new Set(['wide', 'hero', 'floor', 'left', 'right', 'crane']).has(camera)) {
      return companionJson({ ok: false, error: 'Unknown camera.' }, 400);
    }
    state.revision = (Number(state.revision) || 0) + 1;
    state.command = 'camera';
    state.activeCamera = camera;
    await writeCompanionState(url, session, state);
    return companionJson({ ok: true, instanceId: COMPANION_INSTANCE, ...state });
  }

  return companionJson({ ok: false, error: 'Not found.' }, 404);
}

function contactJson(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
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

async function handleContactRequest(request, env, url) {
  if (request.method !== 'POST') return contactJson({ ok: false, error: 'Method not allowed.' }, 405);
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return contactJson({ ok: false, error: 'Origin not allowed.' }, 403);
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 12 * 1024) return contactJson({ ok: false, error: 'Message is too large.' }, 413);

  try {
    const payload = validateContactPayload(await request.json());
    if (payload.bot) return contactJson({ ok: true, delivered: true });
    if (payload.error) return contactJson({ ok: false, error: payload.error }, 400);
    if (!env.RESEND_API_KEY) {
      return contactJson({ ok: false, error: 'Contact delivery is not configured.' }, 503);
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || 'Tawfeeq Martin Website <onboarding@resend.dev>',
        to: [env.CONTACT_TO_EMAIL || 'tawfeeqmartin@gmail.com'],
        reply_to: payload.email,
        subject: `Website note from ${payload.name}`,
        text: [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          '',
          payload.message,
        ].join('\n'),
      }),
    });
    if (!response.ok) {
      console.error('Contact email delivery failed:', response.status, await response.text().catch(() => ''));
      return contactJson({ ok: false, error: 'The message could not be delivered right now.' }, 502);
    }
    const result = await response.json().catch(() => ({}));
    return contactJson({ ok: true, delivered: true, id: result.id || '' });
  } catch (error) {
    console.error('Contact submission failed:', error?.message || error);
    return contactJson({ ok: false, error: 'The message could not be delivered right now.' }, 502);
  }
}

async function fetchUpstreamMedia(mediaUrl, request, headers) {
  return fetch(new Request(mediaUrl, {
    method: request.method,
    headers,
    redirect: 'follow',
  }), {
    cf: {
      cacheEverything: false,
      cacheTtl: 0,
    },
  });
}

async function forwardMediaRequest(request, url) {
  const mediaPath = url.pathname.replace(/^\/media\//, '');
  const mediaUrl = new URL(`${MEDIA_ORIGIN}/${mediaPath}`);
  // HELP is an immutable original MESH WebM. Query strings can make R2/edge
  // range behavior less predictable, so the same-origin proxy intentionally
  // canonicalizes this path before forwarding.
  mediaUrl.search = '';

  const headers = new Headers(request.headers);
  headers.delete('host');
  const rangeHeader = request.headers.get('range');
  if (rangeHeader) {
    headers.set('Range', rangeHeader);
    headers.set('Cache-Control', 'no-cache');
    headers.set('Pragma', 'no-cache');
  }

  let upstream = await fetchUpstreamMedia(mediaUrl, request, headers);
  for (let attempt = 0; rangeHeader && upstream.status === 200 && attempt < 2; attempt += 1) {
    try { await upstream.body?.cancel?.(); } catch (_) {}
    upstream = await fetchUpstreamMedia(mediaUrl, request, headers);
  }

  if (rangeHeader && upstream.status === 200) {
    try { await upstream.body?.cancel?.(); } catch (_) {}
    return new Response('Upstream ignored byte range; retry the request.\n', {
      status: 502,
      headers: {
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Length, Content-Range, Retry-After',
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '1',
        'Vary': 'Origin, Range',
      },
    });
  }

  return upstream;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const companionResponse = await handleCompanionRequest(request, url);
    if (companionResponse) return companionResponse;

    if (url.pathname === '/api/contact') {
      return handleContactRequest(request, env, url);
    }

    if (SAME_ORIGIN_MEDIA.has(url.pathname)) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Range',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { Allow: 'GET, HEAD, OPTIONS' },
        });
      }

      const upstream = await forwardMediaRequest(request, url);
      const headers = new Headers(upstream.headers);
      headers.set('Access-Control-Allow-Origin', url.origin);
      headers.set('Access-Control-Expose-Headers', 'Accept-Ranges, Content-Length, Content-Range, ETag');
      headers.set('Vary', request.headers.has('range') ? 'Origin, Range' : 'Origin');

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
