/**
 * Renders the markdown representation an agent gets when it asks for
 * `Accept: text/markdown` — see ADR-0009 and `vite-markdown.ts`.
 *
 * The body is the *authored* markdown, not markdown reconstructed from the
 * rendered HTML. Converting back would mean shipping an HTML→markdown parser and
 * then teaching it to throw away the header, nav and footer that wrap every
 * page; the source is both cheaper and higher fidelity. What this module adds is
 * the part frontmatter carries and the body does not: the title, the description,
 * and the metadata a page shows in its chrome.
 *
 * Everything here is a pure function of the content snapshot, so the
 * interesting cases are testable without running a build; `vite-markdown.ts`
 * only emits and serves what {@link renderMarkdownFiles} returns.
 */

import {
  blogPosts as blogPostsCollection,
  contentUrl,
  projects as projectsCollection,
  talks as talksCollection,
} from './collections.ts'
import type { ContentSnapshot } from './snapshot.ts'

/** Srcs a client already resolves on its own, so they are never rewritten. */
const ABSOLUTE_SRC = /^(?:https?:|\/\/|\/|data:|#|mailto:)/

/**
 * The `/content/...` URL a body image src points at, or `null` when the src is
 * already absolute. Bodies reference images relative to their document.
 */
export const bodyImageUrl = (
  documentUrl: string,
  src: string,
): string | null =>
  ABSOLUTE_SRC.test(src) ? null : `${documentUrl}/${src.replace(/^\.\//, '')}`

/**
 * Resolves a `/content/...` URL to the URL that actually serves that file in the
 * build, or `null` when nothing does. Supplied by the Vite plugin, which is the
 * only thing that knows the hashed name Rollup gave an asset.
 */
export type ResolveAsset = (publicUrl: string) => string | null

export interface SiteConfig {
  /** Origin with no trailing slash, e.g. `https://noe.tatoud.com`. */
  readonly url: string
  readonly name: string
  readonly description: string
}

/**
 * The public URL of a page's markdown twin.
 *
 * One rule, mirrored by the edge function: a page at `/blog/foo` has its
 * markdown at `/blog/foo.md`, and the home page's lives at `/index.md`. Keeping
 * it derivable means the negotiating edge function needs a single fetch and no
 * manifest, and it leaves every `.md` URL fetchable by hand.
 */
export const markdownPath = (routePath: string): string =>
  routePath === '/' ? '/index.md' : `${routePath.replace(/\/+$/, '')}.md`

/** The same mapping as a build-output file name (no leading slash). */
export const markdownFileName = (routePath: string): string =>
  markdownPath(routePath).slice(1)

const absolute = (site: SiteConfig, routePath: string) =>
  `${site.url}${routePath}`

/**
 * Strips the YAML frontmatter a content file opens with.
 *
 * Every document has one — `@ntatoud/effect-collections` decodes it through the
 * collection's schema and would have failed long before this — so a source that
 * does not match is left untouched rather than treated as an error.
 */
const stripFrontmatter = (source: string): string =>
  source.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '')

/**
 * Points the body's relative image references at the assets that serve them.
 *
 * Body images are authored relative to the document (`![](./diagram.png)`), and
 * nothing serves `content/` at runtime (ADR-0008), so leaving them alone would
 * hand an agent a set of 404s. Both spellings a body can use are rewritten:
 * markdown image syntax, and the raw `<img src>` HTML that `allowHtml` passes
 * through.
 */
function rewriteImages(
  body: string,
  documentUrl: string,
  resolveAsset: ResolveAsset,
  warn: (message: string) => void,
): string {
  const resolve = (src: string): string | null => {
    const publicUrl = bodyImageUrl(documentUrl, src)
    if (publicUrl === null) return null
    const resolved = resolveAsset(publicUrl)
    if (resolved === null) {
      warn(`image not found, left as-is: ${publicUrl}`)
      return null
    }
    return resolved
  }

  return (
    body
      // `![alt](./x.png "title")` — matches through the src only, so any title
      // and the closing paren survive untouched.
      .replace(
        /(!\[[^\]]*\]\(\s*)<?([^)>\s]+)>?/g,
        (whole, open: string, src: string) => {
          const resolved = resolve(src)
          return resolved === null ? whole : `${open}${resolved}`
        },
      )
      .replace(
        /(\bsrc=")([^"]*)(")/g,
        (whole, open: string, src: string, close: string) => {
          const resolved = resolve(src)
          return resolved === null ? whole : `${open}${resolved}${close}`
        },
      )
  )
}

type Entry = string | null | undefined | false

/** Drops blank entries, so optional lines vanish. */
const present = (entries: ReadonlyArray<Entry>) =>
  entries.filter((entry): entry is string => Boolean(entry))

const lines = (...entries: ReadonlyArray<Entry>) => present(entries).join('\n')

const block = (...entries: ReadonlyArray<Entry>) =>
  present(entries).join('\n\n')

/**
 * One `- Label: a, b, c` metadata line, or nothing when the field is absent or
 * empty — so an optional frontmatter array never leaves a dangling label behind.
 */
const metaList = (label: string, values: ReadonlyArray<string> | undefined) =>
  values && values.length > 0 ? `- ${label}: ${values.join(', ')}` : null

/** The frontmatter fields every collection's markdown header can draw on. */
interface DocumentMeta {
  readonly title: string
  readonly description?: string | undefined
  /** Metadata lines specific to the collection, already formatted as `- Key: value`. */
  readonly details?: ReadonlyArray<string | null> | undefined
}

/**
 * A document's markdown twin: a header built from frontmatter, then the authored
 * body.
 *
 * The header is a fixed shape across collections — `# title`, a blockquoted
 * description, a metadata list, a rule — so an agent reading two documents from
 * different collections does not have to learn two layouts.
 */
export function renderDocument(options: {
  readonly site: SiteConfig
  readonly routePath: string
  readonly meta: DocumentMeta
  readonly source: string
  readonly documentUrl: string
  readonly resolveAsset: ResolveAsset
  readonly warn: (message: string) => void
}): string {
  const { site, routePath, meta, source, documentUrl, resolveAsset, warn } =
    options

  const body = rewriteImages(
    stripFrontmatter(source).trim(),
    documentUrl,
    resolveAsset,
    warn,
  )

  const details = lines(
    ...(meta.details ?? []),
    `- Canonical: ${absolute(site, routePath)}`,
  )

  return `${block(
    `# ${meta.title}`,
    meta.description ? `> ${meta.description}` : null,
    details,
    '---',
    body,
  )}\n`
}

/** One `- [Title](url.md): description` entry, the shape llms.txt asks for. */
interface IndexEntry {
  readonly title: string
  /**
   * The page this entry is about, linked as its markdown twin. `null` for things
   * that have no page of their own — an experience, say, which is only ever
   * rendered inline on the home page.
   */
  readonly routePath: string | null
  readonly description?: string | undefined
  /** Shown before the description, e.g. a date or a venue. */
  readonly note?: string | undefined
}

const renderEntry = (site: SiteConfig, entry: IndexEntry) => {
  const head =
    entry.routePath === null
      ? `- **${entry.title}**`
      : `- [${entry.title}](${absolute(site, markdownPath(entry.routePath))})`
  const tail = [entry.note, entry.description].filter(Boolean).join(' — ')
  return tail ? `${head}: ${tail}` : head
}

export interface IndexSection {
  readonly title: string
  readonly description?: string | undefined
  readonly entries: ReadonlyArray<IndexEntry>
}

const renderSection = (site: SiteConfig, section: IndexSection) =>
  block(
    `## ${section.title}`,
    section.description,
    section.entries.length > 0
      ? section.entries.map((entry) => renderEntry(site, entry)).join('\n')
      : '_Nothing here yet._',
  )

/**
 * A listing page's markdown twin — `/blog.md` and friends.
 *
 * Entries link to the *markdown* of each document rather than its HTML, so an
 * agent that starts at a listing can keep following markdown all the way down
 * without re-negotiating on every hop.
 */
export function renderIndex(options: {
  readonly site: SiteConfig
  readonly routePath: string
  readonly title: string
  readonly description?: string | undefined
  readonly sections: ReadonlyArray<IndexSection>
}): string {
  const { site, routePath, title, description, sections } = options

  return `${block(
    `# ${title}`,
    description ? `> ${description}` : null,
    `- Canonical: ${absolute(site, routePath)}`,
    ...sections.map((section) => renderSection(site, section)),
  )}\n`
}

/**
 * `/llms.txt`, in the layout llmstxt.org specifies: an H1, a blockquoted
 * summary, then H2 sections of links.
 *
 * `netlify.toml` has advertised this file in a `Link: rel="describedby"` header
 * since ADR-0005 while nothing served it. Generating it here from the same data
 * as the listings is what makes that header true.
 */
export function renderLlmsTxt(options: {
  readonly site: SiteConfig
  readonly sections: ReadonlyArray<IndexSection>
  readonly optional?: ReadonlyArray<string> | undefined
}): string {
  const { site, sections, optional } = options

  return `${block(
    `# ${site.name}`,
    `> ${site.description}`,
    ...sections
      .filter((section) => section.entries.length > 0)
      .map((section) => renderSection(site, section)),
    optional && optional.length > 0
      ? block('## Optional', optional.join('\n'))
      : null,
  )}\n`
}

/** Joins the parts of a one-line summary, skipping the ones a document omitted. */
const joinNonEmpty = (values: ReadonlyArray<string | null | undefined>) =>
  values.filter(Boolean).join(' · ')

/** A file the build publishes, named by its path under the output directory. */
export interface MarkdownFile {
  readonly fileName: string
  readonly source: string
}

export interface MarkdownFilesOptions {
  readonly site: SiteConfig
  /** The listing and home pages, whose descriptions head their markdown. */
  readonly pages: Readonly<
    Record<
      'home' | 'blog' | 'projects' | 'talks',
      { readonly description: string }
    >
  >
  /** Extra links to advertise under llms.txt's `## Optional` heading. */
  readonly optionalLinks?:
    | ReadonlyArray<{ readonly title: string; readonly path: string }>
    | undefined
  readonly resolveAsset: ResolveAsset
  readonly warn: (message: string) => void
}

/**
 * Every markdown file the build publishes: a twin of each document and listing,
 * the home page's, and `/llms.txt`.
 */
export function renderMarkdownFiles(
  content: ContentSnapshot,
  options: MarkdownFilesOptions,
): ReadonlyArray<MarkdownFile> {
  const { site, pages, resolveAsset, warn } = options

  // Drafts included, matching the detail pages `content()` generates: an
  // unpublished document keeps a reachable page, so it gets a markdown twin.
  // `details` is spelled out per collection rather than derived generically,
  // because what belongs in the header is a judgement about that collection's
  // frontmatter, not a mechanical dump of it.
  const documents = [
    ...content.documents.blogPosts.map(({ slug, data, source }) => ({
      directory: blogPostsCollection.directory,
      slug,
      source,
      routePath: data.url,
      meta: {
        title: data.title,
        description: data.description,
        details: [
          `- Published: ${data.date}`,
          `- Author: ${data.author}`,
          metaList('Tags', data.tags),
          data.externalUrl
            ? `- Originally published: ${data.externalUrl}`
            : null,
          metaList(
            'Translations',
            data.translations?.map(({ lang, url }) => `${lang}: ${url}`),
          ),
        ],
      },
    })),
    ...content.documents.projects.map(({ slug, data, source }) => ({
      directory: projectsCollection.directory,
      slug,
      source,
      routePath: data.path,
      meta: {
        title: data.title,
        description: data.description,
        details: [
          `- Date: ${data.date}`,
          `- Kind: ${data.kind}`,
          data.url ? `- Website: ${data.url}` : null,
          data.repo ? `- Repository: ${data.repo}` : null,
          metaList('Tags', data.tags),
        ],
      },
    })),
    ...content.documents.talks.map(({ slug, data, source }) => ({
      directory: talksCollection.directory,
      slug,
      source,
      routePath: data.path,
      meta: {
        title: data.title,
        description: data.description,
        details: [
          `- Kind: ${data.kind}`,
          data.resource
            ? `- ${data.resource.kind}: ${data.resource.url}`
            : null,
          metaList('Tags', data.tags),
          metaList(
            'Presented at',
            data.events.map((event) =>
              joinNonEmpty([event.event, event.city, event.date]),
            ),
          ),
        ],
      },
    })),
  ]

  // Published documents only, in listing order.
  const listings = [
    {
      title: 'Blog',
      routePath: '/blog',
      description: pages.blog.description,
      entries: content.blogPosts.map((post) => ({
        title: post.title,
        routePath: post.url,
        description: post.description,
        note: post.date,
      })),
    },
    {
      title: 'Projects',
      routePath: '/projects',
      description: pages.projects.description,
      entries: content.projects.map((project) => ({
        title: project.title,
        routePath: project.path,
        description: project.description,
        note: project.kind,
      })),
    },
    {
      title: 'Talks',
      routePath: '/talks',
      description: pages.talks.description,
      entries: content.talks.map((talk) => ({
        title: talk.title,
        routePath: talk.path,
        description: talk.description,
        note: talk.events[0]
          ? joinNonEmpty([talk.events[0].event, talk.events[0].date])
          : talk.kind,
      })),
    },
  ] satisfies ReadonlyArray<IndexSection & { readonly routePath: string }>

  // Experiences have no detail page (they only ever render inline), so they
  // are listed without a link rather than pointed at a markdown twin that
  // would 404.
  const sections: ReadonlyArray<IndexSection> = [
    ...listings,
    {
      title: 'Experience',
      entries: content.experiences.map((experience) => ({
        title: `${experience.title}, ${experience.organization}`,
        routePath: null,
        note: joinNonEmpty([
          experience.kind,
          `${experience.startDate}–${experience.endDate ?? 'present'}`,
        ]),
        description: experience.url,
      })),
    },
  ]

  return [
    ...documents.map((document) => ({
      fileName: markdownFileName(document.routePath),
      source: renderDocument({
        site,
        routePath: document.routePath,
        meta: document.meta,
        source: document.source,
        documentUrl: contentUrl(document.directory, document.slug),
        resolveAsset,
        warn,
      }),
    })),
    ...listings.map(({ title, routePath, description, entries }) => ({
      fileName: markdownFileName(routePath),
      source: renderIndex({
        site,
        routePath,
        title,
        description,
        sections: [{ title, entries }],
      }),
    })),
    {
      fileName: markdownFileName('/'),
      source: renderIndex({
        site,
        routePath: '/',
        title: site.name,
        description: pages.home.description,
        sections,
      }),
    },
    {
      fileName: 'llms.txt',
      source: renderLlmsTxt({
        site,
        sections,
        optional: options.optionalLinks?.map(
          (link) => `- [${link.title}](${site.url}${link.path})`,
        ),
      }),
    },
  ]
}
