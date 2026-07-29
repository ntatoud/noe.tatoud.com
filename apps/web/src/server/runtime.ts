import { CollectionsLive } from '@ntatoud/effect-collections'
import { layer as ogImageLayer } from '@ntatoud/effect-og/image'
import { layer as feedLayer } from '@ntatoud/effect-rss'

import { Layer, ManagedRuntime } from 'effect'

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
