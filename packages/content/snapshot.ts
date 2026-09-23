import { Collections, CollectionsLive } from '@ntatoud/effect-collections'
import type { DocumentMeta } from '@ntatoud/effect-collections'
import { toHtml } from '@ntatoud/effect-markdown'

import { Effect, ManagedRuntime } from 'effect'

import {
  blogPosts as blogPostsCollection,
  caseStudies as caseStudiesCollection,
  experiences as experiencesCollection,
  projects as projectsCollection,
  talks as talksCollection,
} from './collections.ts'
import { getBlogPosts, type BlogPost } from './readers/blog.ts'
import { getCaseStudies, type CaseStudy } from './readers/case-studies.ts'
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
  readonly caseStudies: ReadonlyArray<CaseStudy>
  readonly experiences: ReadonlyArray<Experience>
  readonly talks: ReadonlyArray<StageItem>
  /**
   * Every document on disk, drafts included, sorted by slug: what gets a page
   * and a markdown twin. Experiences have no pages, so they are absent.
   */
  readonly documents: {
    readonly blogPosts: ReadonlyArray<DocumentMeta<BlogPost>>
    readonly projects: ReadonlyArray<DocumentMeta<Project>>
    readonly caseStudies: ReadonlyArray<DocumentMeta<CaseStudy>>
    readonly talks: ReadonlyArray<DocumentMeta<StageItem>>
  }
}

const runtime = ManagedRuntime.make(CollectionsLive)

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
      // Each collection is read from disk exactly once; the listings and the
      // per-document pages are both derived from that one read.
      const [
        blogPostDocuments,
        projectDocuments,
        caseStudyDocuments,
        experienceDocuments,
        talkDocuments,
      ] = yield* Effect.all(
        [
          collections.getAll(blogPostsCollection),
          collections.getAll(projectsCollection),
          collections.getAll(caseStudiesCollection),
          collections.getAll(experiencesCollection),
          collections.getAll(talksCollection),
        ],
        { concurrency: 'unbounded' },
      )
      return {
        blogPosts: getBlogPosts(blogPostDocuments),
        projects: getProjects(projectDocuments),
        caseStudies: getCaseStudies(caseStudyDocuments),
        experiences: getExperiences(experienceDocuments),
        talks: getTalks(talkDocuments),
        documents: {
          blogPosts: bySlug(blogPostDocuments),
          projects: bySlug(projectDocuments),
          caseStudies: bySlug(caseStudyDocuments),
          talks: bySlug(talkDocuments),
        },
      }
    }),
  )

/** Renders one document's body (frontmatter excluded) to HTML. */
export const renderBody = (source: string): Promise<string> =>
  Effect.runPromise(
    toHtml(source).pipe(Effect.map((markdown) => markdown.html)),
  )
