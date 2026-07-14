import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import * as path from 'node:path'

import type { Plugin } from 'vite'

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
}

/** Copies only recognized image files, recursively — never `.mdx` source, which would otherwise leak unpublished draft bodies at a public URL. */
async function copyImages(sourceDir: string, destDir: string): Promise<void> {
  const entries = await fsp
    .readdir(sourceDir, { withFileTypes: true })
    .catch(() => [])

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    if (entry.isDirectory()) {
      await copyImages(sourcePath, path.join(destDir, entry.name))
      continue
    }
    if (!MIME_TYPES[path.extname(entry.name).toLowerCase()]) continue
    await fsp.mkdir(destDir, { recursive: true })
    await fsp.copyFile(sourcePath, path.join(destDir, entry.name))
  }
}

function serveContentAsset(
  contentRoot: string,
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const rawUrl = req.url ?? ''
  const relPath = decodeURIComponent(rawUrl.split('?')[0] ?? '')
  const mime = MIME_TYPES[path.extname(relPath).toLowerCase()]
  if (!mime) {
    next()
    return
  }

  const normalizedRoot = path.resolve(contentRoot) + path.sep
  const filePath = path.join(contentRoot, relPath)
  if (!filePath.startsWith(normalizedRoot)) {
    next()
    return
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      next()
      return
    }
    res.setHeader('Content-Type', mime)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    fs.createReadStream(filePath).pipe(res)
  })
}

/**
 * Serves `packages/content/content/**` image assets under `/content/**`
 * (ADR-0008): a dev middleware that streams files straight off disk, plus a
 * production build step that copies them into the client output so Netlify
 * publishes them alongside the app (matching the `/content/*` cache rule in
 * `netlify.toml`).
 */
export function contentImagesStatic(contentRoot: string): Plugin {
  return {
    name: 'content-images-static',
    configureServer(server) {
      server.middlewares.use('/content', (req, res, next) =>
        serveContentAsset(contentRoot, req, res, next),
      )
    },
    async writeBundle(options) {
      if (!options.dir || path.basename(options.dir) !== 'client') return
      await copyImages(contentRoot, path.join(options.dir, 'content'))
    },
  }
}
