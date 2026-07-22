const CURRENT_RESUME_UPSTREAM = 'https://resume-bmd.pages.dev/resume-readonly';

function notFound() {
  return new Response('Not Found\n', {
    status: 404,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  });
}

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const normalizedPath = incoming.pathname.toLowerCase();

    if (normalizedPath === '/demo' || normalizedPath.startsWith('/demo/')) {
      return notFound();
    }

    if (normalizedPath !== '/resume' && normalizedPath !== '/resume.html') {
      return notFound();
    }

    const upstream = new URL(CURRENT_RESUME_UPSTREAM);
    upstream.search = incoming.search;
    const upstreamResponse = await fetch(new Request(upstream, request), {
      redirect: 'follow',
    });
    const headers = new Headers(upstreamResponse.headers);
    headers.set('cache-control', 'public, max-age=0, must-revalidate');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  },
};
