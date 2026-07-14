/**
 * App-side content reader seam (ADR-0006 amendment to ADR-0002).
 *
 * Every feature imports collection readers and content types from here,
 * never from `@ntatoud/content` or `@ntatoud/effect-content` directly. Blog
 * and Projects now run on the Effect content pipeline
 * (`@ntatoud/effect-content`), behind the server functions in `./server/blog`
 * and `./server/projects` — the only places that package is imported, so
 * Shiki and the MDX compiler stay server-side. Experiences and Talks still
 * re-export the legacy `@ntatoud/content` readers unchanged until they're
 * ported in later issues.
 */
import { getBlogPostServerFn, getBlogPostsServerFn } from './server/blog'
import { getProjectServerFn, getProjectsServerFn } from './server/projects'

export {
  getExperiences,
  type Experience,
  getTalks,
  type StageItem,
  type StageEvent,
} from '@ntatoud/content'

export type {
  BlogPost,
  BlogPostWithBody,
  Project,
  ProjectWithBody,
} from '@ntatoud/effect-content'

export function getBlogPosts() {
  return getBlogPostsServerFn()
}

export function getBlogPost(slug: string) {
  return getBlogPostServerFn({ data: slug })
}

export function getProjects() {
  return getProjectsServerFn()
}

export function getProject(slug: string) {
  return getProjectServerFn({ data: slug })
}
