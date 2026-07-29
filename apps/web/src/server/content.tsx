import type { ComponentType } from 'react'

import {
  getExperiences as getExperiencesFromContent,
  getProject as getProjectFromContent,
  getProjects as getProjectsFromContent,
  getTalk as getTalkFromContent,
  getTalks as getTalksFromContent,
} from '@ntatoud/content'
import type { CollectionError, DocumentNotFound } from '@ntatoud/content'
import type { MdxComponents } from '@ntatoud/effect-mdx'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Effect } from 'effect'

import {
  ProjectCta,
  ProjectInlineLink,
} from '@/features/projects/mdx-components'
import {
  logContentFaults,
  setContentCacheHeaders,
  withBodyHtml,
} from '@/server/content-document'
import { readContent, runtime } from '@/server/runtime'
import type { AppServices } from '@/server/runtime'

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
//
// Blog is the exception: it is served through the typed `HttpApi` in
// `@/content-api` instead, the tracer bullet the other collections will follow.
export const getProjects = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getProjectsFromContent)),
)
export const getExperiences = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getExperiencesFromContent)),
)
export const getTalks = createServerFn({ method: 'GET' }).handler(
  cached(() => readContent(getTalksFromContent)),
)

// Detail reads are the only content reads driven by user-supplied input (a URL
// slug), so they are the only ones that can legitimately not exist. That case
// becomes a 404; every other failure is logged and left to surface as a 500
// instead of masquerading as missing content.
//
// The mapping has to happen here rather than in the route loader: this is the
// last point where the failure is still a real `DocumentNotFound`. Past the
// createServerFn boundary it is a serialized plain object, so `instanceof` no
// longer holds on the client. TanStack's `notFound()` is designed to cross that
// boundary (it becomes a 404 response the client fetcher rethrows), and
// `runPromise` rejects with the failure value unwrapped — so failing with it
// here is equivalent to throwing it, for both SSR and client navigation.
async function readDetail<
  T extends { Content: ComponentType<{ components?: MdxComponents }> },
>(
  read: Effect.Effect<T, CollectionError | DocumentNotFound, AppServices>,
  options: { imageBase: string; components?: MdxComponents },
): Promise<Omit<T, 'Content'> & { bodyHtml: string }> {
  const value = await runtime.runPromise(
    read.pipe(
      // Body rendering is inside the logged region on purpose: an MDX body
      // referencing a missing component throws there, and that is a fault worth
      // a log line just as much as a failed read.
      Effect.flatMap((document) => withBodyHtml(document, options)),
      logContentFaults,
      Effect.catchTag('effect-collections/DocumentNotFound', () =>
        Effect.fail(notFound()),
      ),
    ),
  )
  setContentCacheHeaders()
  return value
}

export const getProject = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    readDetail(getProjectFromContent(data), {
      imageBase: `projects/${data}`,
      components: { ProjectCta, ProjectInlineLink },
    }),
  )
export const getTalk = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data }) =>
    readDetail(getTalkFromContent(data), { imageBase: `talks/${data}` }),
  )
