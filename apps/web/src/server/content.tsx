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

// Matches the /blog/*, /projects/*, /talks/* Cache-Control rules in
// netlify.toml — set here too so the CDN edge cache is populated from the
// origin response itself, not just Netlify's header-rewrite rules.
const CONTENT_CACHE_CONTROL = 'public, max-age=86400'

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
  setResponseHeader('Cache-Control', CONTENT_CACHE_CONTROL)
  const html = renderToStaticMarkup(<Content components={options.components} />)
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
