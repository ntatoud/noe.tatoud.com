import { layer as ogImageLayer } from '@ntatoud/effect-og/image'
import { layer as feedLayer } from '@ntatoud/effect-rss'

import { Layer, ManagedRuntime } from 'effect'

import { FEED_CONFIG } from '@/features/feed/feed-config'
import { OG_FONTS } from '@/features/og/og-fonts'

export { OgImage } from '@ntatoud/effect-og/image'
export { Feed } from '@ntatoud/effect-rss'

/**
 * The single App-wide Effect runtime. Constructed once per serverless instance,
 * it provides the services that genuinely have to run per request — `OgImage`
 * (social-card rendering) and `Feed` (syndication) — from one memoized layer
 * graph.
 *
 * `Collections` used to be in here too. It is not anymore: content is baked into
 * `virtual:content` at build time (ADR-0008), so nothing reads the filesystem at
 * runtime. That also keeps the markdown and highlighting stack out of this graph
 * — loading it was the bulk of what a cold instance paid before it could answer
 * the first navigation.
 *
 * Server-only: `ogImageLayer` pulls in the native `@takumi-rs/core` renderer, so
 * this module must only be referenced from route handlers, never from
 * client-executed code.
 */
const AppLayer = Layer.mergeAll(
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
