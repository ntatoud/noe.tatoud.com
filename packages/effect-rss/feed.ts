import { Context, Effect, Layer, Schema } from 'effect'

import { FeedError } from './errors'
import {
  renderAtom,
  renderJsonFeed,
  renderRss,
  type ResolvedFeedItem,
} from './render'
import { FeedItem, type FeedConfig, type FeedItemInput } from './schema'

const decodeItems = Schema.decodeUnknownEffect(Schema.Array(FeedItem))

/** Parse an item's date string, failing into the error channel when invalid. */
const parseDate = (raw: string, title: string) =>
  Effect.suspend(() => {
    const date = new Date(raw)
    return Number.isNaN(date.getTime())
      ? Effect.fail(
          new FeedError({
            operation: 'parseDate',
            cause: `Invalid date "${raw}" for item "${title}"`,
          }),
        )
      : Effect.succeed(date)
  })

/** Resolve a possibly-relative link/image against the configured origin. */
const toAbsoluteUrl = (value: string, siteUrl: string) =>
  Effect.try({
    try: () => new URL(value, siteUrl).toString(),
    catch: (cause) => new FeedError({ operation: 'resolveUrl', cause }),
  })

const resolveItem = (config: FeedConfig, item: FeedItem) =>
  Effect.gen(function* () {
    const date = yield* parseDate(item.date, item.title)
    const url = yield* toAbsoluteUrl(item.path, config.siteUrl)
    const image = item.image
      ? yield* toAbsoluteUrl(item.image, config.siteUrl)
      : undefined

    return {
      title: item.title,
      url,
      id: item.id ?? url,
      date,
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

export interface FeedShape {
  /** Serialize an RSS 2.0 document. */
  readonly rss: (
    items: ReadonlyArray<FeedItemInput>,
  ) => Effect.Effect<string, FeedError>
  /** Serialize an Atom 1.0 document. */
  readonly atom: (
    items: ReadonlyArray<FeedItemInput>,
  ) => Effect.Effect<string, FeedError>
  /** Serialize a JSON Feed 1.1 document. */
  readonly json: (
    items: ReadonlyArray<FeedItemInput>,
  ) => Effect.Effect<string, FeedError>
}

/** Effect service for building syndication feeds. Provide it with {@link layer}. */
export class Feed extends Context.Service<Feed, FeedShape>()(
  'effect-rss/Feed',
) {}

/** Build the {@link Feed} layer bound to a site's channel configuration. */
export const layer = (config: FeedConfig): Layer.Layer<Feed> =>
  Layer.sync(Feed, () =>
    Feed.of({
      rss: Effect.fn('Feed.rss')(function* (items) {
        const resolved = yield* prepare(config, items)
        return yield* serialize('renderRss', () => renderRss(config, resolved))
      }),
      atom: Effect.fn('Feed.atom')(function* (items) {
        const resolved = yield* prepare(config, items)
        return yield* serialize('renderAtom', () =>
          renderAtom(config, resolved),
        )
      }),
      json: Effect.fn('Feed.json')(function* (items) {
        const resolved = yield* prepare(config, items)
        return yield* serialize('renderJsonFeed', () =>
          renderJsonFeed(config, resolved),
        )
      }),
    }),
  )
