import {
  getBlogPost as getBlogPostFromContent,
  getBlogPosts as getBlogPostsFromContent,
} from '@ntatoud/content'

import { Effect, Layer, Scope } from 'effect'
import {
  Etag,
  HttpEffect,
  HttpPlatform,
  HttpRouter,
} from 'effect/unstable/http'
import { HttpApiBuilder, HttpApiError } from 'effect/unstable/httpapi'

import { contentApi } from '@/content-api/contract'
import type { BlogPost, BlogPostDetail } from '@/content-api/contract'
import {
  logContentFaults,
  setContentCacheHeaders,
  withBodyHtml,
} from '@/server/content-document'
import { runtime } from '@/server/runtime'
import type { AppServices } from '@/server/runtime'

/**
 * The server side of the content `HttpApi`: the handler effects, the router
 * layer that mounts them under `/api/content`, and the in-process entry points
 * SSR uses.
 *
 * Server-only. It is reachable from isomorphic code (`@/content-api`) solely
 * through the `createIsomorphicFn().server(…)` callback there, which the
 * TanStack Start compiler strips — along with this whole import — from the
 * client bundle.
 */

// One read per endpoint, shared by both ways an endpoint is reached: over HTTP
// through the router below, or in-process during SSR. Sharing them is what
// guarantees a client-side navigation and a server render answer with the same
// bytes.
// A `CollectionError` is a read or decode fault, never a legitimate answer, so
// it is converted to a defect rather than left in the error channel: the HTTP
// layer answers a defect with a 500, which is what a bug deserves. Naming the
// tag instead of reaching for `orDie` also means a new failure added upstream
// breaks this build rather than quietly becoming a 500.
const readBlogPosts = logContentFaults(getBlogPostsFromContent).pipe(
  Effect.catchTag('effect-collections/CollectionError', Effect.die),
)

const readBlogPost = (slug: string) =>
  getBlogPostFromContent(slug).pipe(
    Effect.flatMap((post) => withBodyHtml(post, { imageBase: `blog/${slug}` })),
    logContentFaults,
    Effect.catchTag('effect-collections/CollectionError', Effect.die),
    // The contract declares this as the endpoint's only failure, so a missing
    // document is the only thing that can become a 404.
    Effect.catchTag('effect-collections/DocumentNotFound', () =>
      Effect.fail(new HttpApiError.NotFound()),
    ),
  )

const contentGroup = HttpApiBuilder.group(contentApi, 'content', (handlers) =>
  handlers
    .handle('blogPosts', () => readBlogPosts)
    .handle('blogPost', ({ params }) => readBlogPost(params.slug)),
)

// `HttpRouter` is left unprovided: `toHttpEffect` below supplies it while
// building the routes. `FileSystem`, `Path` and `Collections` are left over for
// the App runtime to provide.
const apiLayer = HttpApiBuilder.layer(contentApi).pipe(
  Layer.provide(contentGroup),
  Layer.provide(HttpPlatform.layer),
  Layer.provide(Etag.layerWeak),
)

// The router layer has to outlive the request that built it, so it hangs off a
// scope of its own rather than a request scope. Nothing closes it: on Netlify
// the process *is* the lifetime, and tearing the routes down mid-instance would
// only break the next request.
const routerScope = Scope.makeUnsafe()

let webHandler: Promise<(request: Request) => Promise<Response>> | undefined

/**
 * Serves an `/api/content/*` request, building the router once per serverless
 * instance on first use.
 *
 * Deliberately built on the App runtime and its memoized layers: the endpoints
 * read through the very same `Collections` and MDX compiler instances an
 * in-process SSR read uses, instead of standing up a second content stack.
 */
export function contentWebHandler(request: Request): Promise<Response> {
  webHandler ??= runtime.runPromise(
    Effect.gen(function* () {
      // Handler requirements are resolved per request, not when the routes are
      // registered, so the App services have to be handed to the web handler as
      // its base context rather than merely provided while building `apiLayer`.
      const services = yield* Effect.context<AppServices>()
      const httpEffect = yield* HttpRouter.toHttpEffect(apiLayer)
      return HttpEffect.toWebHandler(Effect.provide(httpEffect, services))
    }).pipe(Effect.provideService(Scope.Scope, routerScope)),
  )
  return webHandler.then((handler) => handler(request))
}

/**
 * Runs a handler in-process, on the App runtime.
 *
 * During SSR the App is already inside the process that owns the content
 * layers, so fetching its own endpoints over HTTP would mean resolving its own
 * origin on Netlify — fragile, and a round trip — to read data it is holding.
 * The cache headers land on the HTML document being rendered, which is exactly
 * the response worth edge-caching for a content page.
 */
const runInProcess = async <A, E>(
  handler: Effect.Effect<A, E, AppServices>,
): Promise<A> => {
  const value = await runtime.runPromise(handler)
  setContentCacheHeaders()
  return value
}

export const getBlogPosts = (): Promise<ReadonlyArray<BlogPost>> =>
  runInProcess(readBlogPosts)

export const getBlogPost = (slug: string): Promise<BlogPostDetail> =>
  runInProcess(readBlogPost(slug))
