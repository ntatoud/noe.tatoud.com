import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

/**
 * Shiki's default entrypoint registers every grammar and theme it ships — 300+
 * chunks, ~12MB, all of which land in the serverless function bundle that has
 * to be downloaded and unzipped on every cold start. We build a fine-grained
 * highlighter with only what the MDX content actually uses instead.
 *
 * Add a language here when a code fence starts using it; unregistered languages
 * render as plain text.
 */
export const getHighlighter = (() => {
  let instance: ReturnType<typeof createHighlighterCore> | undefined
  return () =>
    (instance ??= createHighlighterCore({
      themes: [import('shiki/themes/github-dark.mjs')],
      langs: [
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/jsx.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/bash.mjs'),
      ],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    }))
})()
