import { compile } from '@mdx-js/mdx'
import { Effect } from 'effect'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import type { Highlighter } from 'shiki'

import { CompileFailed } from '#core/errors'
import { rehypeContentImages } from '#core/rehype-content-images'

export type CompileMdxOptions = {
  readonly collection: string
  readonly slug: string
  readonly source: string
  readonly highlighter: Highlighter
  /** Shiki theme handed to `rehype-pretty-code`. */
  readonly theme: string
  /** Public prefix used to rewrite relative body-image refs. */
  readonly assetBaseUrl: string
}

/**
 * Compiles an MDX body to a serializable `function-body` string, running GFM,
 * `rehype-pretty-code` (Shiki, against the shared highlighter) and the relative
 * body-image rewrite. Compilation failures become a typed {@link CompileFailed}.
 */
export const compileMdxBody = (
  options: CompileMdxOptions,
): Effect.Effect<string, CompileFailed> =>
  Effect.tryPromise({
    try: async () => {
      const file = await compile(options.source, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: options.theme,
              getHighlighter: () => options.highlighter,
            },
          ],
          [
            rehypeContentImages,
            {
              assetBaseUrl: options.assetBaseUrl,
              collection: options.collection,
              slug: options.slug,
            },
          ],
        ],
      })
      return String(file)
    },
    catch: (cause) =>
      new CompileFailed({
        collection: options.collection,
        slug: options.slug,
        reason: cause instanceof Error ? cause.message : String(cause),
      }),
  })
