import { beforeAll, describe, expect, it } from 'vitest'

import { catalog } from '../catalog/index.ts'
import { renderMarkdownFiles } from '../markdown.ts'
import { readContentPages, type ContentPage } from '../pages.ts'
import { markdownFileName } from '../paths.ts'
import {
  collectionsOf,
  readContent,
  type AnyCollectionSnapshot,
} from '../snapshot.ts'
import { createPlugin, PAGES, readDeclaredExports } from './helpers.ts'

/**
 * The Content Catalog's contract: every entry yields everything the build
 * promises for it, whichever consumer emits it. Adding a collection is one
 * catalog entry, so this is the test that says the entry was enough.
 */

let collections: ReadonlyArray<AnyCollectionSnapshot>
let twins: Map<string, string>
let pages: ReadonlyArray<ContentPage>
let virtualExports: ReadonlyArray<string>
const declaredExports = readDeclaredExports()

beforeAll(async () => {
  const snapshot = await readContent()
  collections = collectionsOf(snapshot)

  twins = new Map(
    renderMarkdownFiles(snapshot, {
      site: { url: 'https://example.com', name: 'example', description: '.' },
      pages: PAGES,
      resolveAsset: () => null,
      warn: () => {},
    }).map((file) => [file.fileName, file.source]),
  )

  pages = (await readContentPages()).documents

  const code = await createPlugin().generate('virtual:content')
  virtualExports = [...code.matchAll(/^export const (\w+) = /gm)].map(
    ([, name]) => name!,
  )
})

it('reads every entry into the snapshot, in catalog order', () => {
  expect(collections.map((collection) => collection.key)).toEqual(
    catalog.map(({ key }) => key),
  )
})

describe.each(catalog.map((entry) => [entry.key, entry] as const))(
  'catalog entry %s',
  (key, entry) => {
    const snapshotOf = () =>
      collections.find((collection) => collection.key === key)!

    it('lists at least one document', () => {
      expect(snapshotOf().listing.length).toBeGreaterThan(0)
    })

    it('has a listing export, declared in virtual.d.ts', () => {
      expect(virtualExports).toContain(key)
      expect(declaredExports).toContain(key)
    })

    it('has a section in /index.md and /llms.txt', () => {
      const heading = `## ${entry.index.title}`
      expect(twins.get('index.md')).toContain(heading)
      expect(twins.get('llms.txt')).toContain(heading)
    })

    it('gives its listing page a markdown twin', () => {
      if (!entry.listingPage) return
      expect(twins.has(markdownFileName(entry.listingPage.path))).toBe(true)
    })

    it('gives every document a page, a twin and a loader entry', () => {
      const { detail } = snapshotOf()
      if (!entry.detail || !detail) {
        expect(detail).toBeUndefined()
        return
      }

      expect(virtualExports).toContain(entry.detail.loader)
      expect(declaredExports).toContain(entry.detail.loader)

      expect(detail.documents.length).toBeGreaterThan(0)
      // `published` is the Reader's listing, matched by identity: a Reader
      // that copied its documents would silently empty the sitemap.
      expect(
        detail.documents.filter((document) => document.published),
      ).toHaveLength(snapshotOf().listing.length)
      for (const document of detail.documents) {
        expect(twins.has(markdownFileName(document.path)), document.path).toBe(
          true,
        )
        expect(pages).toContainEqual(
          expect.objectContaining({
            path: document.path,
            kind: entry.detail.kind,
          }),
        )
      }
    })
  },
)
