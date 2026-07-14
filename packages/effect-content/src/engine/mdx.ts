import { FileSystem, Path } from '@effect/platform'
import { compile } from '@mdx-js/mdx'
import { Effect } from 'effect'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import type { Highlighter } from 'shiki'

import { CompileFailed } from './errors'
import { rehypeContentImages } from './rehype-content-images'

/**
 * Compiles an MDX body to a serializable `function-body` string (ADR-0007),
 * running GFM, the content-image rewriter (ADR-0008), and
 * `rehype-pretty-code` (Shiki, single `github-dark` theme) against a shared
 * highlighter. Compilation failures become a typed error.
 *
 * The content-image rewriter needs the Effect `FileSystem`/`Path` services
 * (via `resolveImage`) from inside a plain-Promise rehype callback, so this
 * captures the ambient `Runtime` up front and hands it down — the same
 * platform Layer the caller already supplied stays in effect across that
 * Promise boundary.
 */
export const compileMdxBody = (
  contentRoot: string,
  collection: string,
  slug: string,
  source: string,
  highlighter: Highlighter,
): Effect.Effect<string, CompileFailed, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* () {
    const runtime = yield* Effect.runtime<FileSystem.FileSystem | Path.Path>()

    return yield* Effect.tryPromise({
      try: async () => {
        const file = await compile(source, {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [rehypeContentImages, { contentRoot, collection, slug, runtime }],
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
  })
