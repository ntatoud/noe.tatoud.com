import { blogPosts, loadBlogPost } from 'virtual:content'

import { FEEDS, FEED_TITLE, SITE_URL } from '@/lib/site'
import { escapeXml } from '@/lib/xml'

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

// Cross-posts link out to their canonical URL but keep a stable on-domain GUID.
const readItems = (): Promise<ReadonlyArray<FeedItem>> =>
  Promise.all(
    blogPosts.map(async (post): Promise<FeedItem> => {
      const base = {
        title: post.title,
        // Never `NaN`: `DateString` rejects a date it cannot parse.
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
      // The slug comes from the listing, so a missing chunk is a content plugin bug, not a missing post.
      const load = loadBlogPost[post.slug]
      if (!load) throw new Error(`No content chunk for blog post: ${post.slug}`)
      const url = absolute(post.url)
      return { ...base, url, id: url, content: (await load()).default.html }
    }),
  )

const cdata = (value: string): string =>
  `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`

const latestDate = (items: ReadonlyArray<FeedItem>): Date | undefined =>
  items.reduce<Date | undefined>(
    (max, item) => (max === undefined || item.date > max ? item.date : max),
    undefined,
  )

const rssItem = (item: FeedItem): ReadonlyArray<string> => [
  '    <item>',
  `      <title>${escapeXml(item.title)}</title>`,
  `      <link>${escapeXml(item.url)}</link>`,
  `      <guid isPermaLink="${item.id === item.url}">${escapeXml(item.id)}</guid>`,
  `      <pubDate>${item.date.toUTCString()}</pubDate>`,
  ...(item.description
    ? [`      <description>${cdata(item.description)}</description>`]
    : []),
  ...(item.content
    ? [`      <content:encoded>${cdata(item.content)}</content:encoded>`]
    : []),
  ...item.categories.map((c) => `      <category>${escapeXml(c)}</category>`),
  '    </item>',
]

const renderRss = (items: ReadonlyArray<FeedItem>): string => {
  const build = latestDate(items)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${escapeXml(SITE_URL)}</link>`,
    `    <description>${escapeXml(DESCRIPTION)}</description>`,
    `    <language>${escapeXml(LANGUAGE)}</language>`,
    `    <copyright>${escapeXml(COPYRIGHT)}</copyright>`,
    ...(build
      ? [`    <lastBuildDate>${build.toUTCString()}</lastBuildDate>`]
      : []),
    `    <atom:link href="${escapeXml(absolute(FEEDS.rss.path))}" rel="self" type="application/rss+xml"/>`,
    ...items.flatMap(rssItem),
    '  </channel>',
    '</rss>',
  ].join('\n')
}

const atomAuthor = (indent: string): ReadonlyArray<string> => [
  `${indent}<author>`,
  `${indent}  <name>${escapeXml(AUTHOR)}</name>`,
  `${indent}</author>`,
]

const atomEntry = (item: FeedItem): ReadonlyArray<string> => {
  const stamp = item.date.toISOString()
  return [
    '  <entry>',
    `    <title>${escapeXml(item.title)}</title>`,
    `    <link href="${escapeXml(item.url)}"/>`,
    `    <id>${escapeXml(item.id)}</id>`,
    `    <updated>${stamp}</updated>`,
    `    <published>${stamp}</published>`,
    ...atomAuthor('    '),
    ...(item.description
      ? [`    <summary type="html">${cdata(item.description)}</summary>`]
      : []),
    ...(item.content
      ? [`    <content type="html">${cdata(item.content)}</content>`]
      : []),
    ...item.categories.map((c) => `    <category term="${escapeXml(c)}"/>`),
    '  </entry>',
  ]
}

const renderAtom = (items: ReadonlyArray<FeedItem>): string => {
  const updated = latestDate(items)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${escapeXml(FEED_TITLE)}</title>`,
    `  <subtitle>${escapeXml(DESCRIPTION)}</subtitle>`,
    `  <id>${escapeXml(SITE_URL)}</id>`,
    `  <link href="${escapeXml(SITE_URL)}"/>`,
    `  <link href="${escapeXml(absolute(FEEDS.atom.path))}" rel="self" type="application/atom+xml"/>`,
    ...(updated ? [`  <updated>${updated.toISOString()}</updated>`] : []),
    ...atomAuthor('  '),
    `  <rights>${escapeXml(COPYRIGHT)}</rights>`,
    ...items.flatMap(atomEntry),
    '</feed>',
  ].join('\n')
}

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

export const feedResponse = async (
  format: keyof typeof FEEDS,
): Promise<Response> =>
  new Response(RENDERERS[format](await readItems()), {
    headers: { 'Content-Type': `${FEEDS[format].type}; charset=utf-8` },
  })
