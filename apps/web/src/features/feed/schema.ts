import { Schema } from 'effect'

// --- Author ----------------------------------------------------------------

/** A feed author — a name, plus an optional contact email. */
export const FeedAuthor = Schema.Struct({
  name: Schema.NonEmptyString,
  email: Schema.optionalKey(Schema.String),
})
export type FeedAuthor = typeof FeedAuthor.Type

// --- Item ------------------------------------------------------------------

/**
 * One entry in a feed, described semantically. Absolute URLs, GUIDs, and date
 * formatting are derived by the {@link Feed} service, so callers only supply
 * what they know: a title, a link (relative or absolute), and a date.
 */
export const FeedItem = Schema.Struct({
  /** Entry title. */
  title: Schema.NonEmptyString,
  /**
   * Link to the entry — either a site-relative path (`/blog/my-post`, resolved
   * against `siteUrl`) or an absolute URL (used verbatim, e.g. a cross-post).
   */
  path: Schema.NonEmptyString,
  /** Publication date. Any string `new Date(...)` accepts, e.g. `2026-07-18`. */
  date: Schema.String,
  /** Short summary — becomes RSS `<description>` / Atom `<summary>`. */
  description: Schema.optionalKey(Schema.String),
  /** Full HTML body — becomes RSS `<content:encoded>` / Atom `<content>`. */
  content: Schema.optionalKey(Schema.String),
  /** Per-entry author; falls back to the feed-level author when omitted. */
  author: Schema.optionalKey(FeedAuthor),
  /** Categories/tags. */
  categories: Schema.optionalKey(Schema.Array(Schema.String)),
  /** Representative image URL (relative or absolute). */
  image: Schema.optionalKey(Schema.String),
  /** Stable GUID/id. Defaults to the resolved absolute link when omitted. */
  id: Schema.optionalKey(Schema.String),
})
export type FeedItem = typeof FeedItem.Type

/** The plain-object shape callers pass to the feed builder. */
export type FeedItemInput = typeof FeedItem.Encoded

// --- Config ----------------------------------------------------------------

/** Paths of the served feed endpoints, used to emit self-referential links. */
interface FeedPaths {
  /** @default '/rss.xml' */
  readonly rss?: string
  /** @default '/atom.xml' */
  readonly atom?: string
  /** @default '/feed.json' */
  readonly json?: string
}

/** Channel-level configuration bound once when the feed builder is created. */
export interface FeedConfig {
  /** Feed title, e.g. `Noé Tatoud — Blog`. */
  readonly title: string
  /** Feed description/subtitle. */
  readonly description: string
  /** Absolute site origin, e.g. `https://noe.tatoud.com` (no trailing slash). */
  readonly siteUrl: string
  /** BCP-47 language tag, e.g. `en`. */
  readonly language?: string
  /** Copyright/rights notice. */
  readonly copyright?: string
  /** Feed-level author, used when an item omits its own. */
  readonly author?: FeedAuthor
  /** Feed icon URL (relative or absolute) — used by JSON Feed. */
  readonly icon?: string
  /** Override the default self-link paths. */
  readonly feedPaths?: FeedPaths
}
