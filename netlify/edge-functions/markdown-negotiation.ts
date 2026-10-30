import type { Config } from '@netlify/edge-functions'

// Static files are served before app code, so negotiation must happen at the edge (ADR-0009).

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8'

// Duplicated from `vite-markdown.ts` (Deno cannot import this workspace); `test/markdown.test.ts` pins them together.
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

  // `>=` on a tie, and `*/*` is not a vote for HTML: `text/markdown, */*` wins.
  return markdown > 0 && markdown >= html
}

// Same rule as `markdownPath` in `paths.ts`.
export function markdownPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/index.md' : `${trimmed}.md`
}

// Rough estimate: four characters per token.
const estimateTokens = (text: string): number => Math.ceil(text.length / 4)

export default async function handler(
  request: Request,
): Promise<Response | undefined> {
  if (!prefersMarkdown(request.headers.get('accept'))) return

  const url = new URL(request.url)

  // Skips `.md` requests, which also keeps the fetch below from re-entering this function.
  if (url.pathname.endsWith('.md')) return

  const target = new URL(markdownPath(url.pathname), url.origin)
  const markdown = await fetch(target, {
    headers: { accept: 'text/plain' },
  })

  // No twin: fall through so a 404 stays a 404 rendered by the app.
  if (!markdown.ok) return

  const body = await markdown.text()

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': MARKDOWN_TYPE,
      'x-markdown-tokens': String(estimateTokens(body)),
      // Two representations share this URL, so caches must key on `Accept`.
      vary: 'Accept',
      'cache-control': 'public, max-age=0, must-revalidate',
      link: `<${url.origin}${url.pathname}>; rel="canonical"`,
    },
  })
}

/** @public Read by Netlify at deploy time, so nothing imports it. */
export const config: Config = {
  path: '/*',
  // Pre-filter run before invocation: it may over-match (`prefersMarkdown` decides) but must never under-match.
  header: { accept: 'text/(x-)?markdown' },
  // Skips hashed bundles, images, feeds and the `.md` files themselves.
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
