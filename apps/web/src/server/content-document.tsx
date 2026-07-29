import type { ComponentType } from 'react'

import { DocumentNotFound } from '@ntatoud/content'
import type { MdxComponents } from '@ntatoud/effect-mdx'
import { setResponseHeader } from '@tanstack/react-start/server'

import { Effect } from 'effect'
import { renderToStaticMarkup } from 'react-dom/server'

import { resolveContentImage } from '@/lib/content-images'

/**
 * Turning a content Document into the payload the App serves.
 *
 * Server-only: this module renders MDX with `react-dom/server` and reads the
 * Vite image map, so it must never be reachable from the client bundle. Both
 * transports use it — the `createServerFn` readers in `@/server/content` and
 * the `HttpApi` handlers in `@/server/content-api`.
 */

// Content only changes on deploy, and Netlify purges its CDN cache on every
// deploy — so let the edge cache content responses indefinitely instead of
// invoking the serverless function (fs read + MDX compile) on each navigation.
// Browsers keep a short cache so stale tabs recover quickly after a deploy.
export const CONTENT_CACHE_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'public, max-age=300',
  'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=31536000',
}

/**
 * Marks the response currently being served as edge-cacheable.
 *
 * Only call this once the content has resolved, so error responses (e.g. an
 * unknown slug) never get cached. During SSR the "current response" is the HTML
 * document itself, which is exactly what should be cached for a content page.
 */
export function setContentCacheHeaders() {
  for (const [name, value] of Object.entries(CONTENT_CACHE_HEADERS)) {
    setResponseHeader(name, value)
  }
}

/**
 * Logs everything a content read can go wrong with *except* a missing document.
 *
 * A 404 is an ordinary answer that any stale link or crawler will trigger, so
 * leaving it out is what keeps the function logs meaningful. `tapDefect` earns
 * its place next to `tapError`: an MDX plugin throwing outside the typed error
 * channel is precisely the kind of real bug this logging exists to surface.
 */
export const logContentFaults = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A, E, R> =>
  effect.pipe(
    Effect.tapError((error) =>
      error instanceof DocumentNotFound
        ? Effect.void
        : Effect.logError('Content read failed', error),
    ),
    Effect.tapDefect((cause) => Effect.logError('Content read failed', cause)),
  )

// MDX body images are authored relative to the content file (e.g.
// `![](./diagram.png)`), so the compiled HTML carries raw relative srcs that a
// browser would resolve against the page URL (→ 404). Rewrite them through the
// same Vite-processed image map the hero uses, keyed by `<collection>/<slug>`.
function rewriteBodyImages(html: string, imageBase: string): string {
  return html.replace(/\bsrc="([^"]+)"/g, (match, src: string) => {
    if (/^(?:https?:|\/\/|\/|data:|#)/.test(src)) return match
    const relative = src.replace(/^\.\//, '')
    const resolved = resolveContentImage(`${imageBase}/${relative}`)
    return resolved ? `src="${resolved}"` : match
  })
}

/**
 * Replaces a Document's `Content` component with the HTML it renders to.
 *
 * A React component cannot cross a serialization boundary — neither the
 * `createServerFn` RPC nor the JSON body of an `HttpApi` response — so the
 * compiled MDX body travels as `bodyHtml` instead (ADR-0006).
 *
 * `Effect.sync`, not a plain function: rendering the body can throw (an MDX body
 * referencing a component absent from `options.components` does), and that
 * failure deserves the same log line as the read itself instead of escaping as
 * an unexplained 500.
 */
export function withBodyHtml<
  T extends { Content: ComponentType<{ components?: MdxComponents }> },
>(
  document: T,
  options: { imageBase: string; components?: MdxComponents },
): Effect.Effect<Omit<T, 'Content'> & { bodyHtml: string }> {
  return Effect.sync(() => {
    const { Content, ...rest } = document
    const html = renderToStaticMarkup(
      <Content components={options.components} />,
    )
    return { ...rest, bodyHtml: rewriteBodyImages(html, options.imageBase) }
  })
}
