import type { ComponentType } from 'react'

import {
  getBlogPost as getBlogPostFromContent,
  getBlogPosts as getBlogPostsFromContent,
  getExperiences as getExperiencesFromContent,
  getProject as getProjectFromContent,
  getProjects as getProjectsFromContent,
  getTalk as getTalkFromContent,
  getTalks as getTalksFromContent,
} from '@ntatoud/content'
import type { MdxComponents } from '@ntatoud/effect-mdx'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

import { renderToStaticMarkup } from 'react-dom/server'

import { resolveContentImage } from '@/lib/content-images'

// Content only changes on deploy, and Netlify purges its CDN cache on every
// deploy — so let the edge cache these RPC responses indefinitely instead of
// invoking the serverless function (fs read + MDX compile) on each navigation.
// Browsers keep a short cache so stale tabs recover quickly after a deploy.
// Only set headers once the content has resolved, so error responses (e.g.
// unknown slugs) never get cached.
function setContentCacheHeaders() {
  setResponseHeader('Cache-Control', 'public, max-age=300')
  setResponseHeader(
    'Netlify-CDN-Cache-Control',
    'public, durable, s-maxage=31536000',
  )
}

const cached =
  <T,>(read: () => Promise<T>) =>
  async (): Promise<T> => {
    const value = await read()
    setContentCacheHeaders()
    return value
  }

// The content readers read the filesystem (via @ntatoud/effect-collections),
// so they must never run in the browser. createServerFn strips the handler
// (and everything it closes over) from the client bundle and calls it over
// RPC instead.
export const getBlogPosts = createServerFn({ method: 'GET' }).handler(
  cached(getBlogPostsFromContent),
)
export const getProjects = createServerFn({ method: 'GET' }).handler(
  cached(getProjectsFromContent),
)
export const getExperiences = createServerFn({ method: 'GET' }).handler(
  cached(getExperiencesFromContent),
)
export const getTalks = createServerFn({ method: 'GET' }).handler(
  cached(getTalksFromContent),
)

// MDX body images are authored relative to the content file (e.g.
// `![](./diagram.png)`), so the compiled HTML carries raw relative srcs that a
// browser would resolve against the page URL (→ 404). Rewrite them through the
// same Vite-processed image map the hero uses, keyed by `<collection>/<slug>`.
function rewriteBodyImages(html: string, imageBase: string): string {
  return html.replace(/\bsrc="([^"]+)"/g, (match, src: string) => {
    if (/^(?:https?:|\/\/|\/|data:|#)/.test(src)) return match
    const relative = src.replace(/^\.\//, '')
    const resolved = resolveContentImage(`${imageBase}/${relative}`)
    return resolved ? `src="${resolved}"` : match
  })
}

// createServerFn responses are serialized over RPC — a React component
// (Content) can't cross that boundary, so render the MDX body to an HTML
// string here instead.
async function withBodyHtml<
  T extends { Content: ComponentType<{ components?: MdxComponents }> },
>(
  detail: Promise<T>,
  options: { imageBase: string; components?: MdxComponents },
): Promise<Omit<T, 'Content'> & { bodyHtml: string }> {
  const { Content, ...rest } = await detail
  const html = renderToStaticMarkup(<Content components={options.components} />)
  setContentCacheHeaders()
  return {
    ...rest,
    bodyHtml: rewriteBodyImages(html, options.imageBase),
  }
}

export const getBlogPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    withBodyHtml(getBlogPostFromContent(data), { imageBase: `blog/${data}` }),
  )
export const getProject = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    withBodyHtml(getProjectFromContent(data), {
      imageBase: `projects/${data}`,
    }),
  )
export const getTalk = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    withBodyHtml(getTalkFromContent(data), { imageBase: `talks/${data}` }),
  )
