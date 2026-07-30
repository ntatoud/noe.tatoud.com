import type { Config } from '@netlify/edge-functions'

/**
 * Serves a page's markdown twin to any client that asks for
 * `Accept: text/markdown`, and leaves everyone else with HTML. See ADR-0009.
 *
 * This has to run at the edge rather than in the app. Pages are prerendered and
 * published as static files, and static file serving sits at step 12 of Netlify's
 * request chain while edge functions sit at step 5 — so a request for `/blog/foo`
 * is answered off the CDN and never reaches any application code that could look
 * at the `Accept` header. The edge is the first place in the chain that can.
 *
 * The markdown itself is emitted at build time by `@ntatoud/content/vite-markdown`
 * next to the HTML, so this function only routes: it maps `/blog/foo` onto
 * `/blog/foo.md`, fetches it, and re-labels the response. Nothing is converted per
 * request.
 */

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8'

/**
 * Whether this client would rather have markdown than HTML.
 *
 * Deliberately not a substring test on the header. A browser sends
 * `text/html,application/xhtml+xml,application/xml;q=0.9,*\/*;q=0.8`, and a client
 * is entitled to rank markdown *below* HTML — `text/markdown;q=0.5, text/html`
 * must still get HTML. So q-values are parsed and compared.
 *
 * `*\/*` is deliberately not counted as a vote for HTML: an agent sending
 * `Accept: text/markdown, *\/*` named markdown and nothing else, and should get it.
 *
 * Kept in sync with `prefersMarkdown` in `packages/content/vite-markdown.ts`,
 * which drives the dev server. The duplication is forced — this file runs on Deno
 * at Netlify's edge and cannot import from the workspace — and the two are pinned
 * against each other by `packages/content/test/markdown-negotiation.test.ts`.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false

  let markdown = -1
  let html = -1

  for (const part of accept.split(',')) {
    const [rawType, ...parameters] = part.split(';')
    const type = rawType?.trim().toLowerCase()
    if (!type) continue

    let quality = 1
    for (const parameter of parameters) {
      const match = /^\s*q=([\d.]+)\s*$/i.exec(parameter)
      if (match) quality = Number.parseFloat(match[1]!)
    }
    if (!Number.isFinite(quality)) quality = 0

    if (type === 'text/markdown' || type === 'text/x-markdown') {
      markdown = Math.max(markdown, quality)
    } else if (type === 'text/html' || type === 'application/xhtml+xml') {
      html = Math.max(html, quality)
    }
  }

  return markdown > 0 && markdown >= html
}

/**
 * A route's markdown twin: `/` → `/index.md`, `/blog/foo` → `/blog/foo.md`.
 *
 * The single derivable rule is what lets this function work without a manifest
 * and with one fetch. It is the same rule `markdownPath` applies when emitting.
 */
export function markdownPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/index.md' : `${trimmed}.md`
}

/**
 * Four characters per token — the usual rough ratio, and enough for the one thing
 * `x-markdown-tokens` is for: letting an agent size a fetch against its context
 * window before committing to it. Labelled an estimate rather than dressed up as a
 * real tokenizer count, which would mean shipping one model's vocabulary here.
 */
const estimateTokens = (text: string): number => Math.ceil(text.length / 4)

export default async function handler(
  request: Request,
): Promise<Response | undefined> {
  if (!prefersMarkdown(request.headers.get('accept'))) return

  const url = new URL(request.url)

  // The `.md` files are real, fetchable URLs. A request that already names one is
  // served by the static handler as-is — and skipping it here is also what keeps
  // the fetch below from re-entering this function.
  if (url.pathname.endsWith('.md')) return

  const target = new URL(markdownPath(url.pathname), url.origin)
  const markdown = await fetch(target, {
    headers: { accept: 'text/plain' },
  })

  // No markdown twin for this route — a page that is not content-backed, or a URL
  // that does not exist. Either way, fall through and let the normal chain answer,
  // so a 404 stays a 404 rendered by the app.
  if (!markdown.ok) return

  const body = await markdown.text()

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': MARKDOWN_TYPE,
      'x-markdown-tokens': String(estimateTokens(body)),
      // Two representations live at this URL, so any cache between here and the
      // client has to key on the header that chose between them.
      vary: 'Accept',
      'cache-control': 'public, max-age=0, must-revalidate',
      // Points back at the HTML this is a representation of, per RFC 6596.
      link: `<${url.origin}${url.pathname}>; rel="canonical"`,
    },
  })
}

/**
 * Netlify reads this at deploy time to decide when to run the function, so
 * nothing in the repo imports it.
 *
 * @public
 */
export const config: Config = {
  path: '/*',
  // Keeps the function off everything that could not have a markdown twin: hashed
  // bundles, images, the feeds, and the already-markdown files themselves.
  excludedPath: [
    '/assets/*',
    '/.netlify/*',
    '/api/*',
    '/*.md',
    '/*.txt',
    '/*.xml',
    '/*.json',
    '/*.png',
    '/*.jpg',
    '/*.jpeg',
    '/*.webp',
    '/*.avif',
    '/*.gif',
    '/*.svg',
    '/*.ico',
    '/*.css',
    '/*.js',
    '/*.woff',
    '/*.woff2',
  ],
}
