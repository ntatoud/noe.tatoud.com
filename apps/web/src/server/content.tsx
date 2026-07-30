import {
  getBlogPost as getBlogPostFromContent,
  getBlogPosts as getBlogPostsFromContent,
  getExperiences as getExperiencesFromContent,
  getProject as getProjectFromContent,
  getProjects as getProjectsFromContent,
  getTalk as getTalkFromContent,
  getTalks as getTalksFromContent,
} from '@ntatoud/content'
import type { CollectionError, DocumentNotFound } from '@ntatoud/content'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { Effect } from 'effect'

import { resolveContentImage } from '@/lib/content-images'
import { readContent, runtime } from '@/server/runtime'
import type { AppServices } from '@/server/runtime'

// Content only changes on deploy, and Netlify purges its CDN cache on every
// deploy — so let the edge cache these RPC responses indefinitely instead of
// invoking the serverless function (fs read + MDX compile) on each navigation.
// Browsers keep a short cache so stale tabs recover quickly after a deploy.
// Only set headers once the content has resolved, so error responses (e.g.
// unknown slugs) never get cached.
function setContentCacheHeaders() {
  setResponseHeader('Cache-Control', 'public, max-age=300')
  setResponseHeader(
    'Netlify-CDN-Cache-Control',
    'public, durable, s-maxage=31536000',
  )
}

const logContentFailure = (cause: unknown) =>
  Effect.logError('Content read failed', cause)

const cached =
  <T,>(read: () => Promise<T>) =>
  async (): Promise<T> => {
    const value = await read()
    setContentCacheHeaders()
    return value
  }

// The content readers read the filesystem (via @ntatoud/effect-collections),
// so they must never run in the browser. createServerFn strips the handler
// (and everything it closes over) from the client bundle and calls it over
// RPC instead.
export const getBlogPosts = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getBlogPostsFromContent)),
)
export const getProjects = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getProjectsFromContent)),
)
export const getExperiences = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getExperiencesFromContent)),
)
export const getTalks = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getTalksFromContent)),
)

// Body images are authored relative to the content file (e.g.
// `![](./diagram.png)`), so the rendered HTML carries raw relative srcs that a
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

// Detail reads are the only content reads driven by user-supplied input (a URL
// slug), so they are the only ones that can legitimately not exist. That case
// becomes a 404; every other failure is logged and left to surface as a 500
// instead of masquerading as missing content.
//
// The mapping has to happen here rather than in the route loader: this is the
// last point where the failure is still a real `DocumentNotFound`. Past the
// createServerFn boundary it is a serialized plain object, so `instanceof` no
// longer holds on the client. TanStack's `notFound()` is designed to cross that
// boundary (it becomes a 404 response the client fetcher rethrows), and
// `runPromise` rejects with the failure value unwrapped — so failing with it
// here is equivalent to throwing it, for both SSR and client navigation.
function readDetail<A>(
  effect: Effect.Effect<A, CollectionError | DocumentNotFound, AppServices>,
): Promise<A> {
  return runtime.runPromise(
    effect.pipe(
      // Log the real failures only — tapping before the conversion below is
      // what keeps a 404 (an ordinary answer, and one any stale link or crawler
      // will trigger) from filling the function logs with ERROR lines.
      Effect.tapErrorTag(
        'effect-collections/CollectionError',
        logContentFailure,
      ),
      Effect.tapDefect(logContentFailure),
      Effect.catchTag('effect-collections/DocumentNotFound', () =>
        Effect.fail(notFound()),
      ),
    ),
  )
}

// The body reaches us as an HTML string, which crosses the createServerFn RPC
// boundary as-is — all that's left is pointing its relative image srcs at the
// bundled assets.
async function withResolvedImages<T extends { html: string }>(
  detail: Promise<T>,
  imageBase: string,
): Promise<T> {
  const document = await detail
  setContentCacheHeaders()
  return { ...document, html: rewriteBodyImages(document.html, imageBase) }
}

export const getBlogPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    withResolvedImages(
      readDetail(getBlogPostFromContent(data)),
      `blog/${data}`,
    ),
  )
export const getProject = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    withResolvedImages(
      readDetail(getProjectFromContent(data)),
      `projects/${data}`,
    ),
  )
export const getTalk = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    withResolvedImages(readDetail(getTalkFromContent(data)), `talks/${data}`),
  )
