import { notFound } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

import { Effect } from 'effect'
import { FetchHttpClient } from 'effect/unstable/http'
import { HttpApiClient, HttpApiError } from 'effect/unstable/httpapi'

import { contentApi } from '@/content-api/contract'
import type { BlogPost, BlogPostDetail } from '@/content-api/contract'
import {
  getBlogPost as readBlogPostInProcess,
  getBlogPosts as readBlogPostsInProcess,
} from '@/server/content-api'

export type { BlogPost, BlogPostDetail } from '@/content-api/contract'

/**
 * How the App reads content: in-process on the server, over the cacheable GET
 * endpoints in the browser. Route loaders call these and never care which side
 * they are on.
 *
 * `createIsomorphicFn` is what makes that split real rather than a runtime
 * branch — the TanStack Start compiler keeps only the callback for the bundle it
 * is building, so `@/server/content-api` (and the filesystem-backed content
 * pipeline behind it) never reaches the browser.
 */

/**
 * The browser's typed client, derived from the same contract the server
 * implements — so the App has no hand-written idea of what a blog post is on
 * either side.
 *
 * Built at most once: deriving a client compiles an encoder/decoder per
 * endpoint, which is not worth repeating on every navigation. `baseUrl` is left
 * unset so requests go out as same-origin paths (`/api/content/blog`), which is
 * what keeps them on the visitor's edge node.
 */
const makeClient = () =>
  Effect.runPromise(
    Effect.provide(HttpApiClient.make(contentApi), FetchHttpClient.layer),
  )

let clientPromise: ReturnType<typeof makeClient> | undefined
const client = () => (clientPromise ??= makeClient())

const fetchBlogPosts = (): Promise<ReadonlyArray<BlogPost>> =>
  client().then((api) => Effect.runPromise(api.content.blogPosts()))

const fetchBlogPost = (slug: string): Promise<BlogPostDetail> =>
  client().then((api) =>
    Effect.runPromise(api.content.blogPost({ params: { slug } })),
  )

const readBlogPosts = createIsomorphicFn()
  .server(() => readBlogPostsInProcess())
  .client(() => fetchBlogPosts())

const readBlogPost = createIsomorphicFn()
  .server((slug: string) => readBlogPostInProcess(slug))
  .client((slug: string) => fetchBlogPost(slug))

/**
 * Answers a missing post with TanStack's `notFound()`, which routers on both
 * sides understand as a 404.
 *
 * `HttpApiError.NotFound` is the same class in both branches — the in-process
 * handler fails with it directly, and the typed client decodes the endpoint's
 * 404 body back into it — so one `instanceof` covers SSR and client navigation.
 * Every other failure is left alone: it is a real fault and belongs in the logs
 * as a 500, not disguised as missing content.
 */
const withNotFound = async <A>(read: () => Promise<A>): Promise<A> => {
  try {
    return await read()
  } catch (error) {
    if (error instanceof HttpApiError.NotFound) throw notFound()
    throw error
  }
}

export const getBlogPosts = (): Promise<ReadonlyArray<BlogPost>> =>
  readBlogPosts()

export const getBlogPost = (slug: string): Promise<BlogPostDetail> =>
  withNotFound(() => readBlogPost(slug))
