/**
 * Fails the build when a route that should be a static file is missing from
 * `dist/client`. A missing file is not a build error on its own, but the
 * deploy is `dist/client` and nothing else (ADR-0011), so in production that
 * route is simply a 404.
 *
 * Run after `vite build`. Node runs this file directly by stripping its types,
 * so it only uses erasable TypeScript syntax.
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { readContentPages } from '@ntatoud/content/pages'

import { FILE_ROUTES, STATIC_PAGES, ogImagePath } from '../src/lib/site.ts'

// `apps/web` has no test runner, so the one naming rule the meta tags and the
// OG build share is pinned here.
assert.equal(ogImagePath('/'), '/og/index.png')
assert.equal(ogImagePath('/blog'), '/og/blog.png')
assert.equal(ogImagePath('/blog/x/'), '/og/blog/x.png')

// Files that are not pages, so they have no social card.
const REQUIRED_FILES = [
  ...FILE_ROUTES.map((route) => route.slice(1)),
  'llms.txt',
  'index.md',
  '404.html',
]

// Build output, relative to `apps/web`, that means a serverless function is
// back. It would silently change the deploy shape, so it fails the check.
const FORBIDDEN_PATHS = ['.netlify/v1/functions']

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47]

const app = new URL('../', import.meta.url)
const client = new URL('dist/client/', app)
const file = (relative: string) => fileURLToPath(new URL(relative, client))

const missing = REQUIRED_FILES.filter((name) => !existsSync(file(name)))

const forbidden = FORBIDDEN_PATHS.filter((name) =>
  existsSync(fileURLToPath(new URL(name, app))),
)

// Every page must have been prerendered, drafts included, and must have the
// social card its meta tags point at.
const paths = [
  ...Object.values(STATIC_PAGES),
  ...(await readContentPages()),
].map((page) => page.path)

for (const path of paths) {
  const trimmed = path.replace(/^\/+|\/+$/g, '')
  const page = trimmed ? `${trimmed}/index.html` : 'index.html'
  if (!existsSync(file(page))) missing.push(page)

  const image = ogImagePath(path).slice(1)
  if (!existsSync(file(image))) {
    missing.push(image)
    continue
  }
  const header = readFileSync(file(image)).subarray(0, PNG_SIGNATURE.length)
  if (!PNG_SIGNATURE.every((byte, i) => header[i] === byte)) {
    missing.push(`${image} (not a PNG)`)
  }
}

if (missing.length > 0 || forbidden.length > 0) {
  for (const name of missing) console.error(`missing: dist/client/${name}`)
  for (const name of forbidden) console.error(`unexpected: ${name}`)
  process.exit(1)
}

console.log(`ok (${paths.length} pages)`)
