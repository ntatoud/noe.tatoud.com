import { readContent } from './snapshot.ts'

/** A page backed by a content document, with what its social card shows. */
export interface ContentPage {
  readonly path: string
  readonly title: string
  readonly description?: string
  readonly kind: 'blog' | 'project' | 'talk'
}

const toPage = (
  path: string,
  kind: ContentPage['kind'],
  { title, description }: { title: string; description?: string },
): ContentPage =>
  description ? { path, title, description, kind } : { path, title, kind }

/**
 * Every page backed by a content document, drafts included (ADR-0008: a draft
 * keeps a reachable page). It drives both the prerender pass, whose link
 * crawler cannot find a page nothing links to (posts and projects hosted
 * elsewhere have cards that link off-site), and the OG image build.
 */
export const readContentPages = async (): Promise<
  ReadonlyArray<ContentPage>
> => {
  const { documents } = await readContent()
  return [
    ...documents.blogPosts.map(({ data }) => toPage(data.url, 'blog', data)),
    ...documents.projects.map(({ data }) => toPage(data.path, 'project', data)),
    ...documents.talks.map(({ data }) => toPage(data.path, 'talk', data)),
  ]
}

/** The routes of {@link readContentPages}, for the prerender pass. */
export const readContentPaths = async (): Promise<ReadonlyArray<string>> =>
  (await readContentPages()).map(({ path }) => path)
