import { Effect } from 'effect'

import { makeBlogReader } from '../blog/reader'
import { makeExperiencesReader } from '../experiences/reader'
import { makeProjectsReader } from '../projects/reader'
import { makeTalksReader } from '../talks/reader'
import { HighlighterService } from './highlighter'

export type { BlogPost, BlogPostWithBody } from '../blog/reader'
export type { Experience, ExperienceWithBody } from '../experiences/reader'
export type { Project, ProjectWithBody } from '../projects/reader'
export type {
  Talk,
  TalkEvent,
  TalkResource,
  TalkWithBody,
} from '../talks/reader'

/**
 * Composition root that hosts the collection readers. Collection-specific
 * logic lives under `blog/`, `projects/`, `experiences/`, and `talks/`; this
 * service wires each to the shared engine and exposes the reader access
 * (`getBlogPosts`/`getBlogPost`, `getProjects`/`getProject`,
 * `getExperiences`/`getExperience`, `getTalks`/`getTalk`) as the package's
 * entry point.
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
      const blog = yield* makeBlogReader
      const projects = yield* makeProjectsReader
      const experiences = yield* makeExperiencesReader
      const talks = yield* makeTalksReader
      return { ...blog, ...projects, ...experiences, ...talks }
    }),
  },
) {}
