import { readContent } from './snapshot.ts'

/**
 * Every route backed by a content document, drafts included (ADR-0008: a draft
 * keeps a reachable page). The prerender pass is handed this list explicitly,
 * because its link crawler cannot find a page nothing links to: posts and
 * projects hosted elsewhere have cards that link off-site.
 */
export const readContentPaths = async (): Promise<ReadonlyArray<string>> => {
  const { documents } = await readContent()
  return [
    ...documents.blogPosts.map(({ data }) => data.url),
    ...documents.projects.map(({ data }) => data.path),
    ...documents.talks.map(({ data }) => data.path),
  ]
}
