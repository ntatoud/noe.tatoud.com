// Pure, synchronous serializers for RSS 2.0, Atom 1.0, and JSON Feed 1.1.
// Every value that ends up in the document is already resolved (absolute URLs,
// real `Date`s) by the time it reaches here — see `feed.ts`.
import type { FeedAuthor, FeedConfig } from './schema'

/** A feed item with everything the serializers need pre-computed. */
export interface ResolvedFeedItem {
  readonly title: string
  readonly url: string
  readonly id: string
  readonly date: Date
  readonly description?: string
  readonly content?: string
  readonly author?: FeedAuthor
  readonly categories: ReadonlyArray<string>
  readonly image?: string
}

const DEFAULT_PATHS = { rss: '/rss.xml', atom: '/atom.xml', json: '/feed.json' }

/** Escape text for use in an XML text node or attribute value. */
const escape = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

/** Wrap arbitrary HTML in a CDATA section, escaping any nested terminator. */
const cdata = (value: string): string =>
  `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`

/** Resolve a possibly-relative URL against the site origin. */
const absolute = (value: string, siteUrl: string): string =>
  new URL(value, siteUrl).toString()

/** Absolute URL of a served feed endpoint. */
const feedUrl = (config: FeedConfig, key: keyof typeof DEFAULT_PATHS): string =>
  absolute(config.feedPaths?.[key] ?? DEFAULT_PATHS[key], config.siteUrl)

/** Newest item date, or `undefined` for an empty feed. */
const latestDate = (items: ReadonlyArray<ResolvedFeedItem>): Date | undefined =>
  items.reduce<Date | undefined>(
    (max, item) => (max === undefined || item.date > max ? item.date : max),
    undefined,
  )

// --- RSS 2.0 ---------------------------------------------------------------

const rssItem = (item: ResolvedFeedItem): ReadonlyArray<string> => [
  '    <item>',
  `      <title>${escape(item.title)}</title>`,
  `      <link>${escape(item.url)}</link>`,
  `      <guid isPermaLink="${item.id === item.url}">${escape(item.id)}</guid>`,
  `      <pubDate>${item.date.toUTCString()}</pubDate>`,
  ...(item.author?.email
    ? [
        `      <author>${escape(item.author.email)} (${escape(item.author.name)})</author>`,
      ]
    : []),
  ...(item.description
    ? [`      <description>${cdata(item.description)}</description>`]
    : []),
  ...(item.content
    ? [`      <content:encoded>${cdata(item.content)}</content:encoded>`]
    : []),
  ...item.categories.map((c) => `      <category>${escape(c)}</category>`),
  '    </item>',
]

/** Serialize an RSS 2.0 document. */
export const renderRss = (
  config: FeedConfig,
  items: ReadonlyArray<ResolvedFeedItem>,
): string => {
  const build = latestDate(items)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escape(config.title)}</title>`,
    `    <link>${escape(config.siteUrl)}</link>`,
    `    <description>${escape(config.description)}</description>`,
    ...(config.language
      ? [`    <language>${escape(config.language)}</language>`]
      : []),
    ...(config.copyright
      ? [`    <copyright>${escape(config.copyright)}</copyright>`]
      : []),
    ...(build
      ? [`    <lastBuildDate>${build.toUTCString()}</lastBuildDate>`]
      : []),
    `    <atom:link href="${escape(feedUrl(config, 'rss'))}" rel="self" type="application/rss+xml"/>`,
    ...items.flatMap(rssItem),
    '  </channel>',
    '</rss>',
  ].join('\n')
}

// --- Atom 1.0 --------------------------------------------------------------

const atomAuthor = (
  author: FeedAuthor,
  indent: string,
): ReadonlyArray<string> => [
  `${indent}<author>`,
  `${indent}  <name>${escape(author.name)}</name>`,
  ...(author.email
    ? [`${indent}  <email>${escape(author.email)}</email>`]
    : []),
  `${indent}</author>`,
]

const atomEntry = (item: ResolvedFeedItem): ReadonlyArray<string> => {
  const stamp = item.date.toISOString()
  return [
    '  <entry>',
    `    <title>${escape(item.title)}</title>`,
    `    <link href="${escape(item.url)}"/>`,
    `    <id>${escape(item.id)}</id>`,
    `    <updated>${stamp}</updated>`,
    `    <published>${stamp}</published>`,
    ...(item.author ? atomAuthor(item.author, '    ') : []),
    ...(item.description
      ? [`    <summary type="html">${cdata(item.description)}</summary>`]
      : []),
    ...(item.content
      ? [`    <content type="html">${cdata(item.content)}</content>`]
      : []),
    ...item.categories.map((c) => `    <category term="${escape(c)}"/>`),
    '  </entry>',
  ]
}

/** Serialize an Atom 1.0 document. */
export const renderAtom = (
  config: FeedConfig,
  items: ReadonlyArray<ResolvedFeedItem>,
): string => {
  const updated = latestDate(items)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${escape(config.title)}</title>`,
    `  <subtitle>${escape(config.description)}</subtitle>`,
    `  <id>${escape(config.siteUrl)}</id>`,
    `  <link href="${escape(config.siteUrl)}"/>`,
    `  <link href="${escape(feedUrl(config, 'atom'))}" rel="self" type="application/atom+xml"/>`,
    ...(updated ? [`  <updated>${updated.toISOString()}</updated>`] : []),
    ...(config.author ? atomAuthor(config.author, '  ') : []),
    ...(config.copyright
      ? [`  <rights>${escape(config.copyright)}</rights>`]
      : []),
    ...items.flatMap(atomEntry),
    '</feed>',
  ].join('\n')
}

// --- JSON Feed 1.1 ---------------------------------------------------------

/** Serialize a JSON Feed 1.1 document. */
export const renderJsonFeed = (
  config: FeedConfig,
  items: ReadonlyArray<ResolvedFeedItem>,
): string => {
  const jsonAuthor = (author: FeedAuthor) => ({
    name: author.name,
    ...(author.email ? { email: author.email } : {}),
  })

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.title,
    home_page_url: config.siteUrl,
    feed_url: feedUrl(config, 'json'),
    description: config.description,
    ...(config.language ? { language: config.language } : {}),
    ...(config.icon ? { icon: absolute(config.icon, config.siteUrl) } : {}),
    ...(config.author ? { authors: [jsonAuthor(config.author)] } : {}),
    items: items.map((item) => ({
      id: item.id,
      url: item.url,
      title: item.title,
      // JSON Feed requires content_html or content_text on every item.
      content_html: item.content ?? item.description ?? '',
      ...(item.description ? { summary: item.description } : {}),
      date_published: item.date.toISOString(),
      ...(item.categories.length > 0 ? { tags: item.categories } : {}),
      ...(item.author ? { authors: [jsonAuthor(item.author)] } : {}),
      ...(item.image ? { image: item.image } : {}),
    })),
  }
  return JSON.stringify(feed, null, 2)
}
