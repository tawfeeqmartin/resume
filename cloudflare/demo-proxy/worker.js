const DEMO_PREFIX = '/demo';
const DEMO_UPSTREAM = 'https://a5588560.resume-bmd.pages.dev';
const CURRENT_RESUME_UPSTREAM = 'https://resume-bmd.pages.dev/resume-readonly';
const CURRENT_DATA_UPSTREAM = 'https://resume-bmd.pages.dev/data.js';
const CURRENT_APP_UPSTREAM = 'https://resume-bmd.pages.dev/dist/app.js';

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
    const normalizedPath = incoming.pathname.toLowerCase();
    const isCurrentResume = normalizedPath === '/resume.html'
      || normalizedPath === '/resume'
      || normalizedPath === `${DEMO_PREFIX}/resume-readonly.html`
      || normalizedPath === `${DEMO_PREFIX}/resume-readonly`;
    const currentOverride = isCurrentResume
      ? CURRENT_RESUME_UPSTREAM
      : incoming.pathname === `${DEMO_PREFIX}/data.js`
        ? CURRENT_DATA_UPSTREAM
        : incoming.pathname === `${DEMO_PREFIX}/dist/app.js`
          ? CURRENT_APP_UPSTREAM
        : null;
    const upstream = currentOverride
      ? new URL(currentOverride)
      : new URL(upstreamPath(incoming.pathname), DEMO_UPSTREAM);
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
