/**
 * App-side content reader seam (ADR-0006 amendment to ADR-0002).
 *
 * Every feature imports collection readers and content types from here,
 * never from `@ntatoud/content` or `@ntatoud/effect-content` directly. Blog
 * now runs on the Effect content pipeline (`@ntatoud/effect-content`),
 * behind the server functions in `./server/blog` — the only place that
 * package is imported, so Shiki and the MDX compiler stay server-side. The
 * other three collections still re-export the legacy `@ntatoud/content`
 * readers unchanged until they're ported in later issues.
 */
import { getBlogPostServerFn, getBlogPostsServerFn } from './server/blog'

export {
  getExperiences,
  type Experience,
  getProjects,
  type Project,
  getTalks,
  type StageItem,
  type StageEvent,
} from '@ntatoud/content'

export type { BlogPost, BlogPostWithBody } from '@ntatoud/effect-content'

export function getBlogPosts() {
  return getBlogPostsServerFn()
}

export function getBlogPost(slug: string) {
  return getBlogPostServerFn({ data: slug })
}
