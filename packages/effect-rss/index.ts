// Generic, typesafe syndication-feed toolkit built on Effect v4. A site binds
// its channel config once via `makeFeed` (or the `Feed` service + `layer`) and
// renders RSS 2.0, Atom 1.0, and JSON Feed 1.1 from a single item list.
export { FeedError } from './errors'
export { Feed, layer, makeFeed, type FeedRuntime, type FeedShape } from './feed'
export {
  FeedAuthor,
  FeedItem,
  type FeedConfig,
  type FeedItemInput,
  type FeedPaths,
} from './schema'
