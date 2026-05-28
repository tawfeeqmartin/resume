const MEDIA_ORIGIN = 'https://media.tawfeeqmartin.com';
const SAME_ORIGIN_MEDIA = new Set([
  '/media/help_full.webm',
]);

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
