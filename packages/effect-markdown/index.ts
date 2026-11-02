import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'
import type { ParseOptions, RenderOptions } from '@tanstack/markdown'
import { renderHtml } from '@tanstack/markdown/html'
import { parseMarkdown } from '@tanstack/markdown/parser'

import { Effect, Predicate } from 'effect'
import { parse as parseYaml } from 'yaml'

import { MarkdownParseError } from './errors.ts'
import { highlighter } from './languages.ts'

export { MarkdownParseError } from './errors.ts'

export interface Markdown {
  readonly frontmatter: Record<string, unknown>
  readonly html: string
}

// Tolerates a BOM and CRLF because content files are edited by hand.
const FRONTMATTER = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

const parseOptions: ParseOptions = {
  // First-party content only: nothing sanitizes raw HTML.
  allowHtml: true,
}

const renderOptions: RenderOptions = {
  ...parseOptions,
  highlighter: createTanStackMarkdownHighlighter(highlighter),
}

// An empty block parses to null or a scalar; normalise so the schema reports missing fields.
const decodeFrontmatter = (
  block: string | undefined,
): Record<string, unknown> => {
  if (block === undefined) return {}
  const parsed: unknown = parseYaml(block)
  return Predicate.isObject(parsed) ? parsed : {}
}

export const parseFrontmatter = Effect.fn('Markdown.parseFrontmatter')(
  function* (source: string) {
    return yield* Effect.try({
      try: () => decodeFrontmatter(FRONTMATTER.exec(source)?.[1]),
      catch: (cause) => new MarkdownParseError({ cause }),
    })
  },
)

export const toHtml = Effect.fn('Markdown.toHtml')(function* (source: string) {
  return yield* Effect.try({
    try: (): Markdown => {
      const document = parseMarkdown(source, parseOptions)
      return {
        frontmatter: decodeFrontmatter(document.frontmatter),
        html: renderHtml(document, renderOptions),
      }
    },
    catch: (cause) => new MarkdownParseError({ cause }),
  })
})
