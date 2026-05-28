const MEDIA_ORIGIN = 'https://media.tawfeeqmartin.com';
const SAME_ORIGIN_MEDIA = new Set([
  '/media/help_full.webm',
]);

function forwardMediaRequest(request, url) {
  const mediaPath = url.pathname.replace(/^\/media\//, '');
  const mediaUrl = new URL(`${MEDIA_ORIGIN}/${mediaPath}`);
  mediaUrl.search = url.search;

  const headers = new Headers(request.headers);
  headers.delete('host');

  return fetch(new Request(mediaUrl, {
    method: request.method,
    headers,
    redirect: 'follow',
  }));
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
      headers.set('Vary', 'Origin');

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
