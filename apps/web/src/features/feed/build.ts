import { Effect, Schema } from 'effect'

import { FeedError } from './errors'
import {
  renderAtom,
  renderJsonFeed,
  renderRss,
  type ResolvedFeedItem,
} from './render'
import { FeedItem, type FeedConfig, type FeedItemInput } from './schema'

const decodeItems = Schema.decodeUnknownEffect(Schema.Array(FeedItem))

/** Resolve a possibly-relative link/image against the configured origin. */
const toAbsoluteUrl = (value: string, siteUrl: string) =>
  Effect.try({
    try: () => new URL(value, siteUrl).toString(),
    catch: (cause) => new FeedError({ operation: 'resolveUrl', cause }),
  })

const resolveItem = (config: FeedConfig, item: FeedItem) =>
  Effect.gen(function* () {
    const url = yield* toAbsoluteUrl(item.path, config.siteUrl)
    const image = item.image
      ? yield* toAbsoluteUrl(item.image, config.siteUrl)
      : undefined

    return {
      title: item.title,
      url,
      id: item.id ?? url,
      date: item.date,
      description: item.description,
      content: item.content,
      author: item.author ?? config.author,
      categories: item.categories ?? [],
      image,
    } satisfies ResolvedFeedItem
  })

/** Decode raw input and resolve every item's URLs/date. */
const prepare = Effect.fn('Feed.prepare')(function* (
  config: FeedConfig,
  items: ReadonlyArray<FeedItemInput>,
) {
  const decoded = yield* decodeItems(items).pipe(
    Effect.mapError((cause) => new FeedError({ operation: 'decode', cause })),
  )
  return yield* Effect.forEach(decoded, (item) => resolveItem(config, item))
})

/** Serialize resolved items, mapping any thrown serializer error to `FeedError`. */
const serialize = (
  operation: string,
  render: () => string,
): Effect.Effect<string, FeedError> =>
  Effect.try({
    try: render,
    catch: (cause) => new FeedError({ operation, cause }),
  })

const RENDERERS = {
  rss: { operation: 'renderRss', render: renderRss },
  atom: { operation: 'renderAtom', render: renderAtom },
  json: { operation: 'renderJsonFeed', render: renderJsonFeed },
} as const

/**
 * Build an RSS 2.0, Atom 1.0 or JSON Feed 1.1 document from raw feed items:
 * decode them, resolve their URLs and dates, then serialize.
 */
export const buildFeed = Effect.fn('Feed.build')(function* (
  format: keyof typeof RENDERERS,
  config: FeedConfig,
  items: ReadonlyArray<FeedItemInput>,
) {
  const resolved = yield* prepare(config, items)
  const { operation, render } = RENDERERS[format]
  return yield* serialize(operation, () => render(config, resolved))
})
