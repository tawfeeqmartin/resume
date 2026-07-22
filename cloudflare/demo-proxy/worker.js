const DEMO_PREFIX = '/demo';
const DEMO_UPSTREAM = 'https://a5588560.resume-bmd.pages.dev';

function upstreamPath(pathname) {
  if (pathname === DEMO_PREFIX || pathname === `${DEMO_PREFIX}/`) return '/';
  return pathname.startsWith(`${DEMO_PREFIX}/`)
    ? pathname.slice(DEMO_PREFIX.length)
    : pathname;
}

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    if (incoming.pathname === DEMO_PREFIX) {
      incoming.pathname = `${DEMO_PREFIX}/`;
      return Response.redirect(incoming, 308);
    }
    const upstream = new URL(upstreamPath(incoming.pathname), DEMO_UPSTREAM);
    upstream.search = incoming.search;

    const proxiedRequest = new Request(upstream, request);
    const upstreamResponse = await fetch(proxiedRequest, { redirect: 'follow' });
    const headers = new Headers(upstreamResponse.headers);
    headers.set('x-robots-tag', 'noindex');
    headers.set('cache-control', 'public, max-age=0, must-revalidate');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  },
};
