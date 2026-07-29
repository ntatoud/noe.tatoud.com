import { Schema } from 'effect'
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from 'effect/unstable/httpapi'

/**
 * The typed contract for the content data layer.
 *
 * The success schemas below — not a hand-written `BlogPost` interface — are the
 * source of truth for the App's blog types. The server handlers must return
 * exactly `Schema.Type` of the schema they answer with, and the browser client
 * decodes into the same shape, so an in-process SSR read and a client-side
 * navigation fetch can never disagree about what a blog post is.
 *
 * Deliberately free of App and Package imports: the browser derives its typed
 * client from this module, so nothing here may reach the filesystem-backed
 * content pipeline. Its server-side implementation lives in
 * `@/server/content-api`, and the isomorphic readers in `@/content-api`.
 */

const HeroDimensions = Schema.Struct({
  width: Schema.Number,
  height: Schema.Number,
})

const Translation = Schema.Struct({
  lang: Schema.String,
  url: Schema.String,
})

/**
 * A blog post's frontmatter as it crosses the wire: the collection `transform`
 * has already turned the hero into a portable `/content/...` URL and normalized
 * "no external link" to `null`, so this mirrors the Reader's output rather than
 * the raw frontmatter.
 */
const BlogPost = Schema.Struct({
  slug: Schema.String,
  url: Schema.String,
  title: Schema.String,
  description: Schema.optionalKey(Schema.String),
  author: Schema.String,
  date: Schema.String,
  published: Schema.Boolean,
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
  translations: Schema.optionalKey(Schema.Array(Translation)),
  externalUrl: Schema.NullOr(Schema.String),
  hero: Schema.NullOr(Schema.String),
  heroDimensions: Schema.NullOr(HeroDimensions),
})

/**
 * The detail shape carries `bodyHtml`, never the React `Content` component the
 * Reader hands back: a component cannot be serialized, and ADR-0006 settled
 * that the compiled MDX body crosses this boundary as HTML.
 */
const BlogPostDetail = Schema.Struct({
  ...BlogPost.fields,
  bodyHtml: Schema.String,
})

export type BlogPost = typeof BlogPost.Type
export type BlogPostDetail = typeof BlogPostDetail.Type

/**
 * GET, not POST/RPC: these responses are identical for every visitor and only
 * change on deploy, so plain cacheable GETs let Netlify's edge answer
 * navigations without ever waking the serverless function.
 */
const content = HttpApiGroup.make('content')
  .add(
    HttpApiEndpoint.get('blogPosts', '/blog', {
      success: Schema.Array(BlogPost),
    }),
  )
  .add(
    HttpApiEndpoint.get('blogPost', '/blog/:slug', {
      params: { slug: Schema.String },
      success: BlogPostDetail,
      // A slug comes straight from the URL, so a missing post is ordinary input
      // rather than a fault. It is the only declared failure: everything else
      // is a real bug and must surface as a logged 500, not a fake 404.
      error: HttpApiError.NotFound,
    }),
  )

export const contentApi = HttpApi.make('content')
  .add(content)
  .prefix('/api/content')
