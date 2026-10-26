import type { PageKind } from './catalog/index.ts'
import { collectionsOf, readContent } from './snapshot.ts'

/** A page backed by a content document, with what its social card shows. */
export interface ContentPage {
  readonly path: string
  readonly title: string
  readonly description?: string
  readonly kind: PageKind
}

/**
 * Every page backed by a content document, drafts included (ADR-0008: a draft
 * keeps a reachable page). It drives both the prerender pass, whose link
 * crawler cannot find a page nothing links to (posts and projects hosted
 * elsewhere have cards that link off-site), and the OG image build.
 */
export const readContentPages = async (): Promise<ReadonlyArray<ContentPage>> =>
  collectionsOf(await readContent()).flatMap(({ detail }) =>
    detail
      ? detail.documents.map(({ path, title, description }) =>
          description
            ? { path, title, description, kind: detail.kind }
            : { path, title, kind: detail.kind },
        )
      : [],
  )
