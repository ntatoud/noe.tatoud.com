import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'
import type { ParseOptions, RenderOptions } from '@tanstack/markdown'
import { renderHtml } from '@tanstack/markdown/html'
import { parseMarkdown } from '@tanstack/markdown/parser'

import { Context, Effect, Layer } from 'effect'
import { parse as parseYaml } from 'yaml'

import { MarkdownParseError } from './errors.ts'
import { highlighter } from './languages.ts'

export { MarkdownParseError } from './errors.ts'

export interface Markdown {
  readonly frontmatter: Record<string, unknown>
  /** The body rendered to an HTML string, with no React involved. */
  readonly html: string
}

export interface MarkdownCompilerShape {
  readonly toHtml: (
    source: string,
  ) => Effect.Effect<Markdown, MarkdownParseError>
  /**
   * Parses only the YAML frontmatter — skips the body entirely (no block
   * parsing, no highlighting), so it's cheap enough to run over a whole
   * collection.
   */
  readonly frontmatter: (
    source: string,
  ) => Effect.Effect<Record<string, unknown>, MarkdownParseError>
}

export class MarkdownCompiler extends Context.Service<
  MarkdownCompiler,
  MarkdownCompilerShape
>()('effect-markdown/MarkdownCompiler') {}

/**
 * A leading `---` fence, up to the first closing `---` on its own line.
 * Tolerates a BOM and CRLF because content files are edited by hand.
 */
const FRONTMATTER = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

const parseOptions: ParseOptions = {
  // Content is first-party and lives in this repo, so a body may drop into raw
  // HTML for something markdown can't express. Never point the compiler at
  // untrusted input without turning this back off — nothing sanitizes it.
  allowHtml: true,
}

const renderOptions: RenderOptions = {
  ...parseOptions,
  // Adapts the highlighter to the `(code, lang, options)` callback the renderer
  // invokes per fence, honouring `{1,4}` line ranges and `title="…"` meta.
  highlighter: createTanStackMarkdownHighlighter(highlighter),
}

/**
 * An empty or absent frontmatter block parses to `null`/a scalar, neither of
 * which a collection schema can decode. Normalise those to an empty object so
 * the schema is what reports the missing fields.
 */
const decodeFrontmatter = (block: string | undefined) => {
  if (block === undefined) return {}
  const parsed: unknown = parseYaml(block)
  return parsed === null || typeof parsed !== 'object'
    ? {}
    : (parsed as Record<string, unknown>)
}

export const MarkdownCompilerLive = Layer.succeed(
  MarkdownCompiler,
  MarkdownCompiler.of({
    frontmatter: Effect.fn('MarkdownCompiler.frontmatter')(function* (
      source: string,
    ) {
      return yield* Effect.try({
        try: () => decodeFrontmatter(FRONTMATTER.exec(source)?.[1]),
        catch: (cause) => new MarkdownParseError({ cause }),
      })
    }),
    toHtml: Effect.fn('MarkdownCompiler.toHtml')(function* (source: string) {
      return yield* Effect.try({
        try: () => {
          // The parser strips the frontmatter block from `children` and hands it
          // back raw on the document, so the YAML is parsed the same way here as
          // in `frontmatter` above.
          const document = parseMarkdown(source, parseOptions)
          return {
            frontmatter: decodeFrontmatter(document.frontmatter),
            html: renderHtml(document, renderOptions),
          } satisfies Markdown
        },
        catch: (cause) => new MarkdownParseError({ cause }),
      })
    }),
  }),
)
