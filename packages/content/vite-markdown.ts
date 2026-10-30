import * as path from 'node:path'

import type { Plugin } from 'vite'

import { contentFilePath } from './content-url.ts'
import type { MarkdownFilesOptions, ResolveAsset } from './markdown.ts'
import { renderMarkdownFiles } from './markdown.ts'
import { markdownFileName } from './paths.ts'
import { readContent } from './snapshot.ts'

export type ContentMarkdownOptions = Pick<
  MarkdownFilesOptions,
  'site' | 'pages' | 'optionalLinks'
>

export function contentMarkdown(options: ContentMarkdownOptions): Plugin {
  const { site } = options
  let warn: (message: string) => void = () => {}
  let root = process.cwd()
  let base = '/'

  const createResolveAsset = (
    bundle: Record<
      string,
      {
        type: string
        fileName: string
        originalFileNames?: ReadonlyArray<string>
      }
    >,
  ): ResolveAsset => {
    const byOriginal = new Map<string, string>()
    for (const output of Object.values(bundle)) {
      if (output.type !== 'asset') continue
      for (const original of output.originalFileNames ?? []) {
        byOriginal.set(
          path.resolve(root, original),
          `${base}${output.fileName}`,
        )
      }
    }

    return (publicUrl) => {
      const absolute = contentFilePath(publicUrl)
      if (absolute === null) return null
      const served = byOriginal.get(path.resolve(absolute))
      return served === undefined ? null : `${site.url}${served}`
    }
  }

  const generate = async (resolveAsset: ResolveAsset) =>
    renderMarkdownFiles(await readContent(), { ...options, resolveAsset, warn })

  return {
    name: 'ntatoud:content-markdown',

    configResolved(config) {
      warn = (message) => config.logger.warn(`[content-markdown] ${message}`)
      root = config.root
      base = config.base
    },

    // Only the client build's output is published and carries the hashed content images.
    applyToEnvironment: (environment) => environment.name === 'client',

    async generateBundle(_outputOptions, bundle) {
      const files = await generate(createResolveAsset(bundle))

      for (const file of files) {
        this.emitFile({
          type: 'asset',
          // `fileName`, not `name`: these URLs are derived from a route and must not be hashed.
          fileName: file.fileName,
          source: file.source,
        })
      }
    },

    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = request.url?.split('?')[0]
        if (!url) return next()

        const wantsMarkdown = prefersMarkdown(request.headers.accept ?? null)
        const isMarkdownUrl = url.endsWith('.md') || url === '/llms.txt'
        if (!wantsMarkdown && !isMarkdownUrl) return next()

        const fileName = isMarkdownUrl
          ? url.slice(1)
          : markdownFileName(url === '' ? '/' : url)

        let files
        try {
          // `?url` imports are not hashed in dev, so images are served from their source path.
          files = await generate((publicUrl) => `${site.url}${publicUrl}`)
        } catch (error) {
          return next(error)
        }

        const file = files.find((candidate) => candidate.fileName === fileName)
        if (!file) {
          // Ask for HTML explicitly: otherwise TanStack's SSR handler answers a non-HTML `Accept` with JSON.
          request.headers.accept = 'text/html'
          return next()
        }

        response.setHeader('content-type', markdownContentType(fileName))
        response.setHeader(
          'x-markdown-tokens',
          String(estimateTokens(file.source)),
        )
        response.setHeader('vary', 'Accept')
        response.end(file.source)
      })
    },
  }
}

// Duplicated in the edge function (Deno); `test/markdown.test.ts` pins the two together.
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false

  let markdown = -1
  let html = -1

  for (const part of accept.split(',')) {
    const [rawType, ...parameters] = part.split(';')
    const type = rawType?.trim().toLowerCase()
    if (!type) continue

    let quality = 1
    for (const parameter of parameters) {
      const match = /^\s*q=([\d.]+)\s*$/i.exec(parameter)
      if (match) quality = Number.parseFloat(match[1]!)
    }
    if (!Number.isFinite(quality)) quality = 0

    if (type === 'text/markdown' || type === 'text/x-markdown') {
      markdown = Math.max(markdown, quality)
    } else if (type === 'text/html' || type === 'application/xhtml+xml') {
      html = Math.max(html, quality)
    }
  }

  // `>=` on a tie, and `*/*` is not a vote for HTML: `text/markdown, */*` wins.
  return markdown > 0 && markdown >= html
}

const markdownContentType = (fileName: string) =>
  fileName.endsWith('.txt')
    ? 'text/plain; charset=utf-8'
    : 'text/markdown; charset=utf-8'

// Rough estimate: four characters per token.
export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4)
