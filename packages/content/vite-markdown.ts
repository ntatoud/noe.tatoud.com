import * as path from 'node:path'

import type { Plugin } from 'vite'

import { contentFilePath } from './content-url.ts'
import type { MarkdownFilesOptions, ResolveAsset } from './markdown.ts'
import { renderMarkdownFiles } from './markdown.ts'
import { markdownFileName } from './paths.ts'
import { readContent } from './snapshot.ts'

/**
 * Emits a markdown twin of every page into the client build, plus `/llms.txt`.
 *
 * This is the build half of markdown content negotiation (ADR-0009). The other
 * half is `netlify/edge-functions/markdown-negotiation.ts`, which maps a request
 * for `/blog/foo` carrying `Accept: text/markdown` onto the `/blog/foo.md` this
 * plugin emitted. Doing the work here rather than at the edge means an agent pays
 * nothing to convert, and the markdown it gets is the markdown that was authored.
 *
 * Kept separate from `content()` on purpose: that plugin exists to put content
 * *into the JS bundle*, and nothing it generates is involved here. This one only
 * ever writes static files to the output directory.
 */

export type ContentMarkdownOptions = Pick<
  MarkdownFilesOptions,
  'site' | 'pages' | 'optionalLinks'
>

export function contentMarkdown(options: ContentMarkdownOptions): Plugin {
  const { site } = options
  let warn: (message: string) => void = () => {}
  let root = process.cwd()
  let base = '/'

  /**
   * Maps a `/content/...` URL onto the URL that serves that file in this build.
   *
   * The output name is Rollup's to choose — content images are hashed assets
   * emitted by the `?url` imports `content()` generates — so the only honest way
   * to name one is to look it up in the bundle after the fact. `originalFileNames`
   * is the reverse index Rollup keeps for exactly this.
   */
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

    // Only the client build's output is published, and only it carries the
    // hashed content images this needs to resolve against.
    applyToEnvironment: (environment) => environment.name === 'client',

    async generateBundle(_outputOptions, bundle) {
      const files = await generate(createResolveAsset(bundle))

      for (const file of files) {
        this.emitFile({
          type: 'asset',
          // `fileName` rather than `name`: these are URLs the edge function
          // derives from a route, so they must land where it looks and must not
          // go through `assetFileNames` hashing.
          fileName: file.fileName,
          source: file.source,
        })
      }
    },

    /**
     * Serves the same files in `pnpm dev`, and negotiates on `Accept` exactly as
     * the edge function does in production.
     *
     * Without this, markdown negotiation would be untestable until deploy — the
     * one part of the feature that is genuinely easy to get wrong is the mapping
     * from a route to its markdown, and this is where it gets exercised.
     */
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
          // `?url` imports are not hashed in dev, so the dev server serves
          // content images from their source path. Naming them that way keeps
          // dev markdown as fetchable as production markdown.
          files = await generate((publicUrl) => `${site.url}${publicUrl}`)
        } catch (error) {
          return next(error)
        }

        const file = files.find((candidate) => candidate.fileName === fileName)
        if (!file) {
          // No twin for this route — `/styleguide`, say. In production the edge
          // function bows out and Netlify serves the prerendered HTML, which
          // ignores `Accept` entirely. Here the request would instead reach
          // TanStack's SSR handler, which answers a non-HTML `Accept` with the
          // route's JSON payload. Asking for HTML explicitly is what keeps dev
          // showing what production would show.
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

/**
 * The same `Accept` decision the edge function makes, so dev and production agree.
 *
 * Duplicated rather than shared — see the note in the edge function for why — and
 * pinned against it by `test/markdown.test.ts`.
 */
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

  // `>=` on a tie: a client that names both without ranking them is asking for
  // either, and markdown is the one it went out of its way to mention. `*/*` is
  // deliberately not read as a vote for HTML, so `text/markdown, */*` wins.
  return markdown > 0 && markdown >= html
}

const markdownContentType = (fileName: string) =>
  fileName.endsWith('.txt')
    ? 'text/plain; charset=utf-8'
    : 'text/markdown; charset=utf-8'

/**
 * An estimate, and labelled as one: four characters per token is the usual rough
 * ratio and is what the `x-markdown-tokens` header is for — letting an agent size
 * a context window before it commits to the fetch. Running a real tokenizer would
 * mean picking one model's vocabulary and shipping it to the edge, which buys
 * precision no consumer of this header needs.
 */
export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4)
