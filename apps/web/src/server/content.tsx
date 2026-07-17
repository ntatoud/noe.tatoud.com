import type { ComponentType } from 'react'

import {
  getBlogPost as getBlogPostFromContent,
  getBlogPosts as getBlogPostsFromContent,
  getExperience as getExperienceFromContent,
  getExperiences as getExperiencesFromContent,
  getProject as getProjectFromContent,
  getProjects as getProjectsFromContent,
  getTalk as getTalkFromContent,
  getTalks as getTalksFromContent,
} from '@ntatoud/content'
import type { MdxComponents } from '@ntatoud/effect-mdx'
import { createServerFn } from '@tanstack/react-start'

import { renderToStaticMarkup } from 'react-dom/server'

// The content readers read the filesystem (via @ntatoud/effect-collections),
// so they must never run in the browser. createServerFn strips the handler
// (and everything it closes over) from the client bundle and calls it over
// RPC instead.
export const getBlogPosts = createServerFn({ method: 'GET' }).handler(() =>
  getBlogPostsFromContent(),
)
export const getProjects = createServerFn({ method: 'GET' }).handler(() =>
  getProjectsFromContent(),
)
export const getExperiences = createServerFn({ method: 'GET' }).handler(() =>
  getExperiencesFromContent(),
)
export const getTalks = createServerFn({ method: 'GET' }).handler(() =>
  getTalksFromContent(),
)

// createServerFn responses are serialized over RPC — a React component
// (Content) can't cross that boundary, so render the MDX body to an HTML
// string here instead.
async function withBodyHtml<
  T extends { Content: ComponentType<{ components?: MdxComponents }> },
>(
  detail: Promise<T>,
  components?: MdxComponents,
): Promise<Omit<T, 'Content'> & { bodyHtml: string }> {
  const { Content, ...rest } = await detail
  return {
    ...rest,
    bodyHtml: renderToStaticMarkup(<Content components={components} />),
  }
}

export const getBlogPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) => withBodyHtml(getBlogPostFromContent(data)))
export const getProject = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) => withBodyHtml(getProjectFromContent(data)))
export const getExperience = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) => withBodyHtml(getExperienceFromContent(data)))
export const getTalk = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) => withBodyHtml(getTalkFromContent(data)))
