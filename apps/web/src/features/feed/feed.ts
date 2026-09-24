// The blog's RSS 2.0, Atom 1.0 and JSON Feed 1.1 documents. Their routes run
// once, during the build's prerender pass (ADR-0011), and read the published
// posts straight from `virtual:content`.
import { blogPosts, loadBlogPost } from 'virtual:content'

import { FEEDS, FEED_TITLE, SITE_URL } from '@/lib/site'

const DESCRIPTION = 'Articles on software engineering by Noé Tatoud.'
const AUTHOR = 'Noé Tatoud'
const LANGUAGE = 'en'
const COPYRIGHT = '© Noé Tatoud'

interface FeedItem {
  readonly title: string
  readonly url: string
  readonly id: string
  readonly date: Date
  readonly description?: string | undefined
  readonly content?: string | undefined
  readonly categories: ReadonlyArray<string>
  readonly image?: string | undefined
}

const absolute = (value: string): string => new URL(value, SITE_URL).toString()

/**
 * Every published post, newest first. Posts hosted here embed their rendered
 * body; cross-posts link out to their canonical URL while keeping a stable,
 * on-domain GUID. `new Date` cannot yield `NaN`: the content schema rejects a
 * date it cannot parse (`DateString`).
 */
const readItems = (): Promise<ReadonlyArray<FeedItem>> =>
  Promise.all(
    blogPosts.map(async (post): Promise<FeedItem> => {
      const base = {
        title: post.title,
        date: new Date(post.date),
        description: post.description,
        categories: post.tags ?? [],
        image: post.hero ? absolute(post.hero) : undefined,
      }
      if (post.externalUrl) {
        return {
          ...base,
          url: absolute(post.externalUrl),
          id: `${SITE_URL}${post.url}`,
        }
      }
      // The slug comes from the listing, so the chunk always exists; an absent
      // one would be a bug in the content plugin rather than a missing post.
      const load = loadBlogPost[post.slug]
      if (!load) throw new Error(`No content chunk for blog post: ${post.slug}`)
      const url = absolute(post.url)
      return { ...base, url, id: url, content: (await load()).default.html }
    }),
  )

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

/** Newest item date, or `undefined` for an empty feed. */
const latestDate = (items: ReadonlyArray<FeedItem>): Date | undefined =>
  items.reduce<Date | undefined>(
    (max, item) => (max === undefined || item.date > max ? item.date : max),
    undefined,
  )

// --- RSS 2.0 ---------------------------------------------------------------

const rssItem = (item: FeedItem): ReadonlyArray<string> => [
  '    <item>',
  `      <title>${escape(item.title)}</title>`,
  `      <link>${escape(item.url)}</link>`,
  `      <guid isPermaLink="${item.id === item.url}">${escape(item.id)}</guid>`,
  `      <pubDate>${item.date.toUTCString()}</pubDate>`,
  ...(item.description
    ? [`      <description>${cdata(item.description)}</description>`]
    : []),
  ...(item.content
    ? [`      <content:encoded>${cdata(item.content)}</content:encoded>`]
    : []),
  ...item.categories.map((c) => `      <category>${escape(c)}</category>`),
  '    </item>',
]

const renderRss = (items: ReadonlyArray<FeedItem>): string => {
  const build = latestDate(items)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escape(FEED_TITLE)}</title>`,
    `    <link>${escape(SITE_URL)}</link>`,
    `    <description>${escape(DESCRIPTION)}</description>`,
    `    <language>${escape(LANGUAGE)}</language>`,
    `    <copyright>${escape(COPYRIGHT)}</copyright>`,
    ...(build
      ? [`    <lastBuildDate>${build.toUTCString()}</lastBuildDate>`]
      : []),
    `    <atom:link href="${escape(absolute(FEEDS.rss.path))}" rel="self" type="application/rss+xml"/>`,
    ...items.flatMap(rssItem),
    '  </channel>',
    '</rss>',
  ].join('\n')
}

// --- Atom 1.0 --------------------------------------------------------------

const atomAuthor = (indent: string): ReadonlyArray<string> => [
  `${indent}<author>`,
  `${indent}  <name>${escape(AUTHOR)}</name>`,
  `${indent}</author>`,
]

const atomEntry = (item: FeedItem): ReadonlyArray<string> => {
  const stamp = item.date.toISOString()
  return [
    '  <entry>',
    `    <title>${escape(item.title)}</title>`,
    `    <link href="${escape(item.url)}"/>`,
    `    <id>${escape(item.id)}</id>`,
    `    <updated>${stamp}</updated>`,
    `    <published>${stamp}</published>`,
    ...atomAuthor('    '),
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

const renderAtom = (items: ReadonlyArray<FeedItem>): string => {
  const updated = latestDate(items)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${escape(FEED_TITLE)}</title>`,
    `  <subtitle>${escape(DESCRIPTION)}</subtitle>`,
    `  <id>${escape(SITE_URL)}</id>`,
    `  <link href="${escape(SITE_URL)}"/>`,
    `  <link href="${escape(absolute(FEEDS.atom.path))}" rel="self" type="application/atom+xml"/>`,
    ...(updated ? [`  <updated>${updated.toISOString()}</updated>`] : []),
    ...atomAuthor('  '),
    `  <rights>${escape(COPYRIGHT)}</rights>`,
    ...items.flatMap(atomEntry),
    '</feed>',
  ].join('\n')
}

// --- JSON Feed 1.1 ---------------------------------------------------------

const renderJson = (items: ReadonlyArray<FeedItem>): string =>
  JSON.stringify(
    {
      version: 'https://jsonfeed.org/version/1.1',
      title: FEED_TITLE,
      home_page_url: SITE_URL,
      feed_url: absolute(FEEDS.json.path),
      description: DESCRIPTION,
      language: LANGUAGE,
      authors: [{ name: AUTHOR }],
      items: items.map((item) => ({
        id: item.id,
        url: item.url,
        title: item.title,
        // JSON Feed requires content_html or content_text on every item.
        content_html: item.content ?? item.description ?? '',
        ...(item.description ? { summary: item.description } : {}),
        date_published: item.date.toISOString(),
        ...(item.categories.length > 0 ? { tags: item.categories } : {}),
        authors: [{ name: AUTHOR }],
        ...(item.image ? { image: item.image } : {}),
      })),
    },
    null,
    2,
  )

const RENDERERS = { rss: renderRss, atom: renderAtom, json: renderJson }

/** The response a feed route serves. */
export const feedResponse = async (
  format: keyof typeof FEEDS,
): Promise<Response> =>
  new Response(RENDERERS[format](await readItems()), {
    headers: { 'Content-Type': `${FEEDS[format].type}; charset=utf-8` },
  })
