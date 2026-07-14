/**
 * App-side content reader seam (ADR-0006 amendment to ADR-0002).
 *
 * Every feature imports collection readers and content types from here,
 * never from `@ntatoud/content` or `@ntatoud/effect-content` directly. Blog,
 * Projects, Experiences, and Talks all run on the Effect content pipeline
 * (`@ntatoud/effect-content`), behind the server functions in `./server/blog`,
 * `./server/projects`, `./server/experiences`, and `./server/talks` — the
 * only places that package is imported, so Shiki and the MDX compiler stay
 * server-side.
 */
import { getBlogPostServerFn, getBlogPostsServerFn } from './server/blog'
import {
  getExperienceServerFn,
  getExperiencesServerFn,
} from './server/experiences'
import { getProjectServerFn, getProjectsServerFn } from './server/projects'
import { getTalkServerFn, getTalksServerFn } from './server/talks'

export type {
  BlogPost,
  BlogPostWithBody,
  Experience,
  ExperienceWithBody,
  Project,
  ProjectWithBody,
  Talk,
  TalkEvent,
  TalkResource,
  TalkWithBody,
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

export function getTalks() {
  return getTalksServerFn()
}

export function getTalk(slug: string) {
  return getTalkServerFn({ data: slug })
}
