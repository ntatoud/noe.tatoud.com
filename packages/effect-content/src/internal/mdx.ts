import { compile } from '@mdx-js/mdx'
import { Effect } from 'effect'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import type { Highlighter } from 'shiki'

import { CompileFailed } from '../errors'

/**
 * Compiles an MDX body to a serializable `function-body` string (ADR-0007),
 * running GFM and `rehype-pretty-code` (Shiki, single `github-dark` theme)
 * against a shared highlighter. Compilation failures become a typed error.
 */
export const compileMdxBody = (
  collection: string,
  slug: string,
  source: string,
  highlighter: Highlighter,
): Effect.Effect<string, CompileFailed> =>
  Effect.tryPromise({
    try: async () => {
      const file = await compile(source, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              getHighlighter: () => highlighter,
            },
          ],
        ],
      })
      return String(file)
    },
    catch: (cause) =>
      new CompileFailed({
        collection,
        slug,
        reason: cause instanceof Error ? cause.message : String(cause),
      }),
  })
