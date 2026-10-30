import type { ListingName } from './catalog/index.ts'
import { contentUrl } from './content-url.ts'
import { markdownFileName, markdownPath } from './paths.ts'
import { collectionsOf, type ContentSnapshot } from './snapshot.ts'

const ABSOLUTE_SRC = /^(?:https?:|\/\/|\/|data:|#|mailto:)/

export const bodyImageUrl = (
  documentUrl: string,
  src: string,
): string | null =>
  ABSOLUTE_SRC.test(src) ? null : `${documentUrl}/${src.replace(/^\.\//, '')}`

export type ResolveAsset = (publicUrl: string) => string | null

export interface SiteConfig {
  readonly url: string
  readonly name: string
  readonly description: string
}

const absolute = (site: SiteConfig, routePath: string) =>
  `${site.url}${routePath}`

// Every document has frontmatter (its schema decoded it), so a source that does not match is left untouched.
const stripFrontmatter = (source: string): string =>
  source.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '')

// Nothing serves `content/` at runtime (ADR-0008): left relative, body images would 404 for an agent.
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

  return body
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
}

type Entry = string | null | undefined | false

const present = (entries: ReadonlyArray<Entry>) =>
  entries.filter((entry): entry is string => Boolean(entry))

const lines = (...entries: ReadonlyArray<Entry>) => present(entries).join('\n')

const block = (...entries: ReadonlyArray<Entry>) =>
  present(entries).join('\n\n')

interface DocumentMeta {
  readonly title: string
  readonly description?: string | undefined
  readonly details?: ReadonlyArray<string | null> | undefined
}

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

export interface IndexEntry {
  readonly title: string
  // `null` for pages that do not exist (an experience only renders inline on the home page).
  readonly routePath: string | null
  readonly description?: string | undefined
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

export interface MarkdownFile {
  readonly fileName: string
  readonly source: string
}

export interface MarkdownFilesOptions {
  readonly site: SiteConfig
  readonly pages: Readonly<
    Record<'home' | ListingName, { readonly description: string }>
  >
  readonly optionalLinks?:
    | ReadonlyArray<{ readonly title: string; readonly path: string }>
    | undefined
  readonly resolveAsset: ResolveAsset
  readonly warn: (message: string) => void
}

export function renderMarkdownFiles(
  content: ContentSnapshot,
  options: MarkdownFilesOptions,
): ReadonlyArray<MarkdownFile> {
  const { site, pages, resolveAsset, warn } = options
  const collections = collectionsOf(content)

  // Collections with no listing page (experiences) still get a section in `/index.md` and `/llms.txt`.
  const listed = collections.map(({ index, listingPage }) => ({
    listingPage,
    section: {
      title: index.title,
      description: listingPage
        ? pages[listingPage.name].description
        : undefined,
      entries: index.entries,
    },
  }))
  const sections = listed.map(({ section }) => section)

  return [
    // Drafts included: an unpublished document keeps a reachable page, so it keeps its twin.
    ...collections.flatMap(({ directory, detail }) =>
      (detail?.documents ?? []).map((document) => ({
        fileName: markdownFileName(document.path),
        source: renderDocument({
          site,
          routePath: document.path,
          meta: document,
          source: document.source,
          documentUrl: contentUrl(directory, document.slug),
          resolveAsset,
          warn,
        }),
      })),
    ),
    ...listed.flatMap(({ listingPage, section }) =>
      listingPage
        ? [
            {
              fileName: markdownFileName(listingPage.path),
              source: renderIndex({
                site,
                routePath: listingPage.path,
                title: section.title,
                description: section.description,
                sections: [{ title: section.title, entries: section.entries }],
              }),
            },
          ]
        : [],
    ),
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
