import { Collections, CollectionsLive } from '@ntatoud/effect-collections'
import type { DocumentMeta } from '@ntatoud/effect-collections'
import {
  MarkdownCompiler,
  MarkdownCompilerLive,
} from '@ntatoud/effect-markdown'

import { Effect, Layer, ManagedRuntime } from 'effect'

import {
  blogPosts as blogPostsCollection,
  projects as projectsCollection,
  talks as talksCollection,
} from './collections.ts'
import { getBlogPosts, type BlogPost } from './readers/blog.ts'
import { getExperiences, type Experience } from './readers/experiences.ts'
import { getProjects, type Project } from './readers/projects.ts'
import { getTalks, type StageItem } from './readers/talks.ts'

/**
 * Everything the build knows about content. Both Vite plugins (`vite.ts` and
 * `vite-markdown.ts`) read it from here, so "which documents exist" is answered
 * in one place.
 */
export interface ContentSnapshot {
  /** Published documents, ordered by their reader: what listings show. */
  readonly blogPosts: ReadonlyArray<BlogPost>
  readonly projects: ReadonlyArray<Project>
  readonly experiences: ReadonlyArray<Experience>
  readonly talks: ReadonlyArray<StageItem>
  /**
   * Every document on disk, drafts included, sorted by slug: what gets a page
   * and a markdown twin. Experiences have no pages, so they are absent.
   */
  readonly documents: {
    readonly blogPosts: ReadonlyArray<DocumentMeta<BlogPost>>
    readonly projects: ReadonlyArray<DocumentMeta<Project>>
    readonly talks: ReadonlyArray<DocumentMeta<StageItem>>
  }
}

const runtime = ManagedRuntime.make(
  Layer.mergeAll(CollectionsLive, MarkdownCompilerLive),
)

// Plain code-unit order, so the generated loader maps list slugs the same way
// on every machine.
const bySlug = <A>(documents: ReadonlyArray<DocumentMeta<A>>) =>
  [...documents].sort((a, b) =>
    a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0,
  )

export const readContent = (): Promise<ContentSnapshot> =>
  runtime.runPromise(
    Effect.gen(function* () {
      const collections = yield* Collections
      const [blogPosts, projects, experiences, talks] = yield* Effect.all([
        getBlogPosts,
        getProjects,
        getExperiences,
        getTalks,
      ])
      const [blogPostDocuments, projectDocuments, talkDocuments] =
        yield* Effect.all([
          collections.getAll(blogPostsCollection),
          collections.getAll(projectsCollection),
          collections.getAll(talksCollection),
        ])
      return {
        blogPosts,
        projects,
        experiences,
        talks,
        documents: {
          blogPosts: bySlug(blogPostDocuments),
          projects: bySlug(projectDocuments),
          talks: bySlug(talkDocuments),
        },
      }
    }),
  )

/** Renders one document's body (frontmatter excluded) to HTML. */
export const renderBody = (source: string): Promise<string> =>
  runtime.runPromise(
    MarkdownCompiler.use((compiler) => compiler.toHtml(source)).pipe(
      Effect.map((markdown) => markdown.html),
    ),
  )
