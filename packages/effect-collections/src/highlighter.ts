import { Context, Effect, Layer } from 'effect'
import { createHighlighter } from 'shiki'

/** Default Shiki theme; override with {@link HighlighterService.layer}. */
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

/**
 * Holds a single Shiki highlighter instance, created once when the Layer is
 * built and reused across every compile. It is intentionally not disposed: it
 * lives for the lifetime of the process (and is shared with
 * `rehype-pretty-code`'s own process-global highlighter cache), so disposing it
 * would break later compiles. The active `theme` is carried alongside so the MDX
 * compiler can hand it back to `rehype-pretty-code`.
 */
export class HighlighterService extends Context.Service<HighlighterService>()(
  'effect-collections/HighlighterService',
  { make: make(DEFAULT_THEME) },
) {
  /** Highlighter Layer using the {@link DEFAULT_THEME}. */
  static readonly Default = Layer.effect(
    HighlighterService,
    make(DEFAULT_THEME),
  )

  /** Highlighter Layer using an explicit Shiki theme. */
  static readonly layer = (theme: string) =>
    Layer.effect(HighlighterService, make(theme))
}
