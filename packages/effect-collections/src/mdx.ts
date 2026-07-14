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
  readonly theme: string
  readonly assetBaseUrl: string
}

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
