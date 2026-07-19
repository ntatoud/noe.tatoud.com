import { createElement } from 'react'
import type { ComponentType } from 'react'

import { evaluate } from '@mdx-js/mdx'
import { Context, Effect, Layer } from 'effect'
import matter from 'gray-matter'
import * as runtime from 'react/jsx-runtime'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { parse as parseYaml } from 'yaml'

import { MarkdownParseError } from './errors'

export { MarkdownParseError } from './errors'

// gray-matter unconditionally calls `Buffer.from` to keep the raw input
// around; browsers don't have a global Buffer, so stub just enough of it.
const globalWithBuffer = globalThis as { Buffer?: unknown }
if (typeof globalWithBuffer.Buffer === 'undefined') {
  globalWithBuffer.Buffer = {
    from: (input: string) => input,
    isBuffer: () => false,
  }
}

export type MdxComponents = Record<string, ComponentType<any>>

export interface Markdown {
  readonly frontmatter: Record<string, unknown>
  readonly Content: ComponentType<{ readonly components?: MdxComponents }>
}

export interface ToJsxOptions {
  /** Default components available to any custom tag used in the MDX body (e.g. `<Callout>`). */
  readonly components?: MdxComponents
}

export interface MdxCompilerShape {
  readonly toJsx: (
    source: string,
    options?: ToJsxOptions,
  ) => Effect.Effect<Markdown, MarkdownParseError>
  /**
   * Parses only the YAML frontmatter — skips MDX evaluation entirely (no
   * remark/rehype/Shiki), so it's cheap enough to run over a whole collection.
   */
  readonly frontmatter: (
    source: string,
  ) => Effect.Effect<Record<string, unknown>, MarkdownParseError>
}

export class MdxCompiler extends Context.Service<
  MdxCompiler,
  MdxCompilerShape
>()('effect-mdx/MdxCompiler') {}

const parseMatter = (source: string) =>
  Effect.try({
    try: () =>
      matter(source, {
        engines: { yaml: (input: string) => parseYaml(input) },
      }),
    catch: (cause) => new MarkdownParseError({ cause }),
  })

export const MdxCompilerLive = Layer.succeed(
  MdxCompiler,
  MdxCompiler.of({
    frontmatter: Effect.fn('MdxCompiler.frontmatter')(function* (
      source: string,
    ) {
      const { data } = yield* parseMatter(source)
      return data
    }),
    toJsx: Effect.fn('MdxCompiler.toJsx')(function* (
      source: string,
      options?: ToJsxOptions,
    ) {
      const { data: frontmatter, content } = yield* parseMatter(source)
      const { default: MDXContent } = yield* Effect.tryPromise({
        try: () =>
          evaluate(content, {
            ...runtime,
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
          }),
        catch: (cause) => new MarkdownParseError({ cause }),
      })
      const defaultComponents = options?.components
      const Content: Markdown['Content'] = (props) =>
        createElement(MDXContent, {
          ...props,
          components: { ...defaultComponents, ...props.components },
        })
      return { frontmatter, Content } satisfies Markdown
    }),
  }),
)
