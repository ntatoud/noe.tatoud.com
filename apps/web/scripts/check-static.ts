/**
 * Fails the build when a route that should be a static file is missing from
 * `dist/client`. A missing file is not a build error on its own, but the
 * deploy is `dist/client` and nothing else (ADR-0011), so in production that
 * route is simply a 404.
 *
 * Run after `vite build`. Node runs this file directly by stripping its types,
 * so it only uses erasable TypeScript syntax.
 */
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { sitePages } from '@ntatoud/content/inventory'
import { readContentPages } from '@ntatoud/content/pages'

import { FILE_ROUTES, SITE_URL, STATIC_PAGES } from '../src/lib/site.ts'

// Files that are not pages, so they have no social card.
const REQUIRED_FILES = [
  ...FILE_ROUTES.map((route) => route.slice(1)),
  'llms.txt',
  '404.html',
]

// Build output, relative to `apps/web`, that means a serverless function is
// back. It would silently change the deploy shape, so it fails the check.
const FORBIDDEN_PATHS = ['.netlify/v1/functions']

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47]

// The `content` of a page's `<meta property="...">` tag, if it has exactly one.
const metaProperty = (html: string, property: string) => {
  const tags = html.match(/<meta\b[^>]*>/g) ?? []
  const values = tags
    .filter((tag) => tag.includes(`property="${property}"`))
    .map((tag) => /\bcontent="([^"]*)"/.exec(tag)?.[1])
  return values.length === 1 ? values[0] : undefined
}

const app = new URL('../', import.meta.url)
const client = new URL('dist/client/', app)
const file = (relative: string) => fileURLToPath(new URL(relative, client))

const missing = REQUIRED_FILES.filter((name) => !existsSync(file(name)))

const forbidden = FORBIDDEN_PATHS.filter((name) =>
  existsSync(fileURLToPath(new URL(name, app))),
)

// Every page must have been prerendered, drafts included, and must have its
// markdown twin and the social card its meta tags point at. Its meta tags must
// name the page itself, not a parent route's page.
const pages = sitePages(await readContentPages(), STATIC_PAGES)
const wrongMeta: string[] = []

for (const { path, ogImage, markdown } of pages) {
  const trimmed = path.replace(/^\/+|\/+$/g, '')
  const html = trimmed ? `${trimmed}/index.html` : 'index.html'
  for (const name of [html, markdown.slice(1)]) {
    if (!existsSync(file(name))) missing.push(name)
  }

  if (existsSync(file(html))) {
    const document = readFileSync(file(html), 'utf8')
    const expected = {
      'og:url': SITE_URL + path,
      'og:image': SITE_URL + ogImage,
    }
    for (const [property, value] of Object.entries(expected)) {
      const actual = metaProperty(document, property)
      if (actual !== value) {
        wrongMeta.push(
          `${html}: ${property} is ${actual ?? 'not set once'}, expected ${value}`,
        )
      }
    }
  }

  const image = ogImage.slice(1)
  if (!existsSync(file(image))) {
    missing.push(image)
    continue
  }
  const header = readFileSync(file(image)).subarray(0, PNG_SIGNATURE.length)
  if (!PNG_SIGNATURE.every((byte, i) => header[i] === byte)) {
    missing.push(`${image} (not a PNG)`)
  }
}

if (missing.length > 0 || forbidden.length > 0 || wrongMeta.length > 0) {
  for (const name of missing) console.error(`missing: dist/client/${name}`)
  for (const name of forbidden) console.error(`unexpected: ${name}`)
  for (const message of wrongMeta) console.error(`wrong meta: ${message}`)
  process.exit(1)
}

console.log(`ok (${pages.length} pages)`)
