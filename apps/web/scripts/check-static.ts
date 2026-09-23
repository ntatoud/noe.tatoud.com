/**
 * Fails the build when a route that should be a static file is missing from
 * `dist/client`. A missing file is not a build error on its own: Netlify simply
 * falls back to the serverless function for it, on every request.
 *
 * Run after `vite build`. Node runs this file directly by stripping its types,
 * so it only uses erasable TypeScript syntax.
 */
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ORIGIN = 'https://noe.tatoud.com'

// Files that are not pages, so the sitemap does not list them.
const REQUIRED_FILES = [
  'rss.xml',
  'atom.xml',
  'feed.json',
  'sitemap.xml',
  'llms.txt',
  'index.md',
]

const client = new URL('../dist/client/', import.meta.url)
const file = (relative: string) => fileURLToPath(new URL(relative, client))

const missing = REQUIRED_FILES.filter((name) => !existsSync(file(name)))

// Every page the sitemap advertises must have been prerendered.
const pages = existsSync(file('sitemap.xml'))
  ? [
      ...readFileSync(file('sitemap.xml'), 'utf8').matchAll(
        /<loc>([^<]+)<\/loc>/g,
      ),
    ]
      .map(([, loc]) =>
        loc!
          .trim()
          .replace(ORIGIN, '')
          .replace(/^\/+|\/+$/g, ''),
      )
      .map((path) => (path ? `${path}/index.html` : 'index.html'))
  : []

for (const page of pages) {
  if (!existsSync(file(page))) missing.push(page)
}

if (missing.length > 0) {
  for (const name of missing) console.error(`missing: dist/client/${name}`)
  process.exit(1)
}

console.log(`ok (${pages.length} pages)`)
