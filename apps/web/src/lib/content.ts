/**
 * App-side content reader seam (ADR-0006 amendment to ADR-0002).
 *
 * Every feature imports collection readers and content types from here,
 * never from `@ntatoud/content` or `@ntatoud/effect-content` directly. Blog,
 * Projects, and Experiences now run on the Effect content pipeline
 * (`@ntatoud/effect-content`), behind the server functions in `./server/blog`,
 * `./server/projects`, and `./server/experiences` — the only places that
 * package is imported, so Shiki and the MDX compiler stay server-side. Talks
 * still re-exports the legacy `@ntatoud/content` reader unchanged until it's
 * ported in a later issue.
 */
import { getBlogPostServerFn, getBlogPostsServerFn } from './server/blog'
import {
  getExperienceServerFn,
  getExperiencesServerFn,
} from './server/experiences'
import { getProjectServerFn, getProjectsServerFn } from './server/projects'

export { getTalks, type StageItem, type StageEvent } from '@ntatoud/content'

export type {
  BlogPost,
  BlogPostWithBody,
  Experience,
  ExperienceWithBody,
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

export function getExperiences() {
  return getExperiencesServerFn()
}

export function getExperience(slug: string) {
  return getExperienceServerFn({ data: slug })
}
