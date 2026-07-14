import { Context, Effect, Layer } from 'effect'
import { createHighlighter } from 'shiki'

const THEME = 'github-dark'

const LANGS = [
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'json',
  'bash',
  'html',
  'css',
  'python',
  'yaml',
  'markdown',
]

const makeHighlighter = Effect.map(
  Effect.promise(() => createHighlighter({ themes: [THEME], langs: LANGS })),
  (highlighter) => ({ highlighter }),
)

/**
 * Holds a single Shiki highlighter instance, created once when the Layer is
 * built and reused across Documents. It is intentionally not disposed: it lives
 * for the lifetime of the process (and is shared with `rehype-pretty-code`'s own
 * process-global highlighter cache), so disposing it would break later compiles.
 */
export class HighlighterService extends Context.Service<HighlighterService>()(
  '@ntatoud/effect-content/HighlighterService',
  { make: makeHighlighter },
) {
  static readonly Default = Layer.effect(HighlighterService, makeHighlighter)
}
