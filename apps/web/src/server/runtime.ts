import { CollectionsLive } from '@ntatoud/effect-collections'
import { layer as ogImageLayer } from '@ntatoud/effect-og/image'
import { layer as feedLayer } from '@ntatoud/effect-rss'

import { Effect, Layer, ManagedRuntime } from 'effect'

import { FEED_CONFIG } from '@/features/feed/feed-config'
import { OG_FONTS } from '@/features/og/og-fonts'

export { OgImage } from '@ntatoud/effect-og/image'
export { Feed } from '@ntatoud/effect-rss'

/**
 * The single App-wide Effect runtime. Constructed once per serverless
 * instance, it provides every server service — `Collections` (content reads),
 * `OgImage` (social-card rendering), and `Feed` (syndication) — from one
 * memoized layer graph. Server modules run their Effects through it instead
 * of each standing up their own runtime.
 *
 * Server-only: this module pulls in filesystem and native (`@takumi-rs/core`)
 * layers, so it must only be referenced inside route/server-function handlers,
 * never from client-executed code.
 */
const AppLayer = Layer.mergeAll(
  CollectionsLive,
  ogImageLayer({
    fonts: OG_FONTS,
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control': 'public, immutable, max-age=31536000',
    },
  }),
  feedLayer(FEED_CONFIG),
)

export const runtime = ManagedRuntime.make(AppLayer)

/**
 * The services `runtime` provides — i.e. the requirement an Effect is allowed
 * to still carry when it is run through it. Server modules that wrap
 * `runtime.runPromise` in their own helpers name this instead of restating the
 * service list (or widening to `never`, which no content read satisfies).
 */
export type AppServices = ManagedRuntime.ManagedRuntime.Services<typeof runtime>

/**
 * Runs a content read on the App runtime, logging any failure before it
 * propagates. `tapCause`, not `tapError`: a defect (e.g. an MDX plugin throwing
 * outside the typed error channel) is exactly the kind of real bug this logging
 * exists to surface, and `tapError` would skip it.
 *
 * Every content read goes through here so a failure is never silent — otherwise
 * the only trace of a broken document is the error serialized into the response,
 * which never reaches the function logs. Reads that can legitimately find
 * nothing use `readDetail` in `@/server/content`, which layers the 404 answer on
 * top of this.
 *
 * It lives here rather than in `@/server/content` on purpose: an export of that
 * module survives into the client bundle (only `createServerFn` *handlers* are
 * stripped), which would pull this whole server-only layer graph — filesystem
 * and the native `@takumi-rs/core` renderer — into the browser.
 */
export function readContent<A, E>(
  effect: Effect.Effect<A, E, AppServices>,
): Promise<A> {
  return runtime.runPromise(
    Effect.tapCause(effect, (cause) =>
      Effect.logError('Content read failed', cause),
    ),
  )
}
