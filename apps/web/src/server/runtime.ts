import { layer as feedLayer } from '@ntatoud/effect-rss'

import { ManagedRuntime } from 'effect'

import { FEED_CONFIG } from '@/features/feed/feed-config'

export { Feed } from '@ntatoud/effect-rss'

/**
 * The single App-wide Effect runtime. It provides `Feed` (syndication) to the
 * feed routes, which the prerender pass runs at build time.
 *
 * `OgImage` used to be in here too. It is not anymore: social cards are
 * rendered to static files at build time by `plugins/og-images.ts` (ADR-0010),
 * so nothing renders an image per request.
 *
 * Neither is `Collections`: content is baked into `virtual:content` at build
 * time (ADR-0008), so nothing reads the filesystem at runtime. That also keeps
 * the markdown and highlighting stack out of this graph.
 *
 * Server-only: this module must only be referenced from route handlers, never
 * from client-executed code.
 */
export const runtime = ManagedRuntime.make(feedLayer(FEED_CONFIG))
