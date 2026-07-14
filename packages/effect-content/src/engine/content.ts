import { FileSystem, Path } from '@effect/platform'
import { Effect, Either } from 'effect'

import { makeBlogReader } from '../blog/reader'
import { makeExperiencesReader } from '../experiences/reader'
import { makeProjectsReader } from '../projects/reader'
import { makeTalksReader } from '../talks/reader'
import { collectImageRefs } from './collect-image-refs'
import { ContentConfig } from './config'
import type { ContentNotFound, FrontmatterInvalid } from './errors'
import { HighlighterService } from './highlighter'
import { imageRefExists, isRelativeRef } from './image'
import { compileMdxBody } from './mdx'

export type { BlogPost, BlogPostWithBody } from '../blog/reader'
export type { Experience, ExperienceWithBody } from '../experiences/reader'
export type { Project, ProjectWithBody } from '../projects/reader'
export type {
  Talk,
  TalkEvent,
  TalkResource,
  TalkWithBody,
} from '../talks/reader'

const BLOG = 'blog'
const PROJECTS = 'projects'
const EXPERIENCES = 'experiences'
const TALKS = 'talks'

/**
 * A single build-time content problem found by {@link ContentService.validate}
 * — invalid frontmatter, a missing referenced image (frontmatter `hero`/`logo`
 * or an inline body ref), or un-compilable MDX. Unlike the reader programs
 * (`getBlogPost`, …), `validate` never fails the Effect itself: it walks every
 * Document in every collection (published or not) and collects every problem
 * it finds, so a caller can report them all in one build failure rather than
 * stopping at the first.
 */
export type ContentValidationIssue = {
  readonly kind: 'frontmatter-invalid' | 'image-not-found' | 'compile-failed'
  readonly collection: string
  readonly slug: string
  readonly file: string
  readonly detail: string
}

/** Renders a {@link ContentValidationIssue} as a single precise, actionable line naming the file (and, for frontmatter, the field). */
export const formatContentValidationIssue = (
  issue: ContentValidationIssue,
): string =>
  `[${issue.collection}/${issue.slug}] ${issue.file}\n  ${issue.kind}: ${issue.detail}`

/**
 * Composition root that hosts the collection readers. Collection-specific
 * logic lives under `blog/`, `projects/`, `experiences/`, and `talks/`; this
 * service wires each to the shared engine and exposes the reader access
 * (`getBlogPosts`/`getBlogPost`, `getProjects`/`getProject`,
 * `getExperiences`/`getExperience`, `getTalks`/`getTalk`) as the package's
 * entry point, plus the build-time {@link ContentValidationIssue}-collecting
 * `validate` program.
 *
 * `Default` depends on the abstract `FileSystem`/`Path` services (never a
 * concrete platform) so the package stays framework-agnostic: the runner
 * provides `NodeContext.layer` (or another platform Layer) at the edge.
 */
export class ContentService extends Effect.Service<ContentService>()(
  '@ntatoud/effect-content/ContentService',
  {
    dependencies: [HighlighterService.Default],
    effect: Effect.gen(function* () {
      const { contentRoot } = yield* ContentConfig
      const { highlighter } = yield* HighlighterService
      const fs = yield* FileSystem.FileSystem
      const path = yield* Path.Path

      const {
        getBlogPosts,
        getBlogPost,
        readFrontmatter: readBlog,
      } = yield* makeBlogReader
      const {
        getProjects,
        getProject,
        readFrontmatter: readProject,
      } = yield* makeProjectsReader
      const {
        getExperiences,
        getExperience,
        readFrontmatter: readExperience,
      } = yield* makeExperiencesReader
      const {
        getTalks,
        getTalk,
        readFrontmatter: readTalk,
      } = yield* makeTalksReader

      /**
       * Lists Document slugs (immediate subdirectories containing an
       * `index.mdx`) under a collection directory, via the Effect `FileSystem`.
       */
      const listSlugs = (dir: string) =>
        Effect.gen(function* () {
          const entries = yield* fs
            .readDirectory(dir)
            .pipe(Effect.orElseSucceed((): Array<string> => []))

          const slugs: Array<string> = []
          for (const name of entries) {
            const hasDocument = yield* fs
              .exists(path.join(dir, name, 'index.mdx'))
              .pipe(Effect.orElseSucceed(() => false))
            if (hasDocument) slugs.push(name)
          }
          return slugs
        })

      /**
       * Validates a single collection: every slug (published or not) gets its
       * frontmatter decoded, its referenced images (the frontmatter fields
       * named by `imageFieldsOf`, plus any inline body refs) checked for
       * existence on disk via the Effect `FileSystem`, and its MDX body
       * compiled — collecting every problem rather than stopping at the first,
       * so `validate` can report everything wrong with the content tree in one
       * build failure.
       */
      const validateCollection = <F>(
        collection: string,
        dir: string,
        readDocument: (
          slug: string,
        ) => Effect.Effect<
          { frontmatter: F; body: string; file: string },
          ContentNotFound | FrontmatterInvalid
        >,
        imageFieldsOf: (frontmatter: F) => ReadonlyArray<string | undefined>,
      ) =>
        Effect.gen(function* () {
          const issues: Array<ContentValidationIssue> = []
          const slugs = yield* listSlugs(dir)

          for (const slug of slugs) {
            const file = path.join(dir, slug, 'index.mdx')
            const result = yield* readDocument(slug).pipe(Effect.either)

            if (Either.isLeft(result)) {
              const error = result.left
              if (error._tag === 'FrontmatterInvalid') {
                issues.push({
                  kind: 'frontmatter-invalid',
                  collection,
                  slug,
                  file,
                  detail: error.reason,
                })
              }
              continue
            }

            const { frontmatter, body } = result.right
            const refs = [
              ...imageFieldsOf(frontmatter).filter(
                (ref): ref is string =>
                  typeof ref === 'string' && isRelativeRef(ref),
              ),
              ...collectImageRefs(body),
            ]

            for (const ref of refs) {
              const exists = yield* imageRefExists(
                contentRoot,
                collection,
                slug,
                ref,
              )
              if (!exists) {
                const cleaned = ref.replace(/^\.\//, '')
                issues.push({
                  kind: 'image-not-found',
                  collection,
                  slug,
                  file,
                  detail: `missing image "${ref}" (resolved: ${path.join(dir, slug, cleaned)})`,
                })
              }
            }

            const compiled = yield* compileMdxBody(
              contentRoot,
              collection,
              slug,
              body,
              highlighter,
            ).pipe(Effect.either)

            if (Either.isLeft(compiled)) {
              issues.push({
                kind: 'compile-failed',
                collection,
                slug,
                file,
                detail: compiled.left.reason,
              })
            }
          }

          return issues
        })

      /**
       * Walks every Document in all four collections (published or not) and
       * returns every {@link ContentValidationIssue} found — invalid
       * frontmatter, a missing referenced image, or un-compilable MDX. Never
       * fails itself; an empty array means the content tree is clean. Talk
       * Event logos are excluded: they are pass-through frontmatter strings
       * today (often absolute `/public` paths), not Document-relative refs.
       */
      const validate = () =>
        Effect.gen(function* () {
          const results = yield* Effect.all([
            validateCollection(
              BLOG,
              path.join(contentRoot, BLOG),
              readBlog,
              (fm) => [fm.hero],
            ),
            validateCollection(
              PROJECTS,
              path.join(contentRoot, PROJECTS),
              readProject,
              () => [],
            ),
            validateCollection(
              EXPERIENCES,
              path.join(contentRoot, EXPERIENCES),
              readExperience,
              (fm) => [fm.logo],
            ),
            validateCollection(
              TALKS,
              path.join(contentRoot, TALKS),
              readTalk,
              () => [],
            ),
          ])
          return results.flat()
        })

      return {
        getBlogPosts,
        getBlogPost,
        getProjects,
        getProject,
        getExperiences,
        getExperience,
        getTalks,
        getTalk,
        validate,
      } as const
    }),
  },
) {}
