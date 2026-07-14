import { Context, Effect, Layer } from 'effect'
import { createHighlighter } from 'shiki'

export const DEFAULT_THEME = 'github-dark'

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

const make = (theme: string) =>
  Effect.map(
    Effect.promise(() => createHighlighter({ themes: [theme], langs: LANGS })),
    (highlighter) => ({ highlighter, theme }),
  )

// Not disposed: shared with rehype-pretty-code's process-global highlighter
// cache and lives for the process lifetime — disposing it would break later
// compiles.
export class HighlighterService extends Context.Service<HighlighterService>()(
  'effect-collections/HighlighterService',
  { make: make(DEFAULT_THEME) },
) {
  static readonly Default = Layer.effect(
    HighlighterService,
    make(DEFAULT_THEME),
  )

  static readonly layer = (theme: string) =>
    Layer.effect(HighlighterService, make(theme))
}
