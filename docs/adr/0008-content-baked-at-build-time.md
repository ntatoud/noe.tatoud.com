# ADR-0008: content is baked into the bundle at build time

> Superseded in part by [ADR-0011](./0011-static-deploy.md): there is no serverless function anymore.

ADR-0006 removed the codegen step and had the App read collections through Effect's `FileSystem` at request time, behind `createServerFn`. That is reversed: a Vite plugin, `@ntatoud/content/vite`, reads every collection during the build and emits `virtual:content`. No page reads the filesystem at runtime, and there are no content server functions left.

## Why

Content is data in the repo — it can only change on deploy. Reading it per request meant a page's data came over the wire from a Netlify function on every client-side navigation, and the pages are prerendered, so the _first_ load never needed it. Measured on production (commit `a623f61`):

|                                                    |                       |
| -------------------------------------------------- | --------------------- |
| `/_serverFn/…` for the blog listing, cold instance | **6883 ms**           |
| same call, warm instance                           | 150 ms                |
| same call, edge hit                                | 17 ms                 |
| the underlying read, locally                       | 21 ms cold, 3 ms warm |

The read itself was never the cost. Loading the function's module graph was: `@ntatoud/effect-markdown` alone took 813 ms to import on a warm local SSD (ADR-0007's TanStack stack later cut that to 283 ms), and listing pages pay it for a chain they never call — a listing only parses frontmatter. On a cold Lambda that becomes seconds.

`/` made this worst: its loader ran four collections through `Promise.all`, i.e. four separate RPCs that Netlify can answer from four separate instances, each paying its own cold start, to render a handful of titles.

The responses carried `Netlify-CDN-Cache-Control: durable, s-maxage=31536000`, which is sound, but a deploy purges the durable cache — so the first visitor after every deploy paid the full cold start on every route.

## What is emitted

- **`virtual:content`** — the four listing arrays, eagerly. Roughly 8 KB of frontmatter for 13 documents, cheap in the entry bundle.
- **`virtual:content/detail/<collection>/<slug>`** — one module per document, carrying its rendered `html`, reached only through the `loadBlogPost`/`loadProject`/`loadTalk` maps as a dynamic import. Rollup therefore gives each document its own chunk, and a detail page downloads only its own body.

Listings go through `packages/content`'s existing readers, so the schemas, `published` filter and ordering stay defined in exactly one place. Detail slugs deliberately do **not** go through them: they are read straight off disk, unfiltered, so an unpublished draft keeps a reachable page just as reading per request allowed.

**Images are real imports.** Frontmatter image fields and relative body srcs become `import … from '/abs/path.png?url'` in the generated module, so Vite hashes, emits and fingerprints them. This replaces both the per-request `rewriteBodyImages` regex and `apps/web/src/lib/content-images.ts`, whose eager `import.meta.glob` shipped a URL map for _every_ content image; unreferenced images now stay out of the bundle entirely. A missing file is warned about and left as-is rather than failing the build.

## Consequences

- **`apps/web/src/server/content.tsx` is deleted** — all seven content server functions, `setContentCacheHeaders`, `readDetail` and `withResolvedImages` with it. A 404 is now "this slug has no entry in the map", checked in the loader.
- **Listing routes have no loader at all.** Returning a build-time constant from a loader would additionally serialize it into the SSR payload, shipping the same bytes twice.
- **`Collections` left the App runtime.** `apps/web/src/server/runtime.ts` provides only `OgImage` and `Feed` now, so the markdown and highlighting stack is no longer in the serverless function's module graph. `/api/og` is the only route still needing a runtime service.
- **Feeds and the sitemap read `virtual:content`** instead of the runtime readers; `getSitemapUrls` became synchronous.
- **`content/**` was dropped from `netlify.toml`'s `included_files`** — nothing reads it at runtime.
- **Bundle size is unchanged.** `/` ships 162 KB encoded / 491 KB decoded of JS, against 161.6 / 490 before: the baked listing data is offset by the deleted content RPC chunk (23 KB encoded) and `content-images` (3 KB).
- **Relative imports inside `packages/**` now carry explicit `.ts` extensions.** `apps/web/vite.config.ts` imports the plugin, so the package graph has to be resolvable by Node's ESM loader, which does not do extensionless resolution. `allowImportingTsExtensions` was already on.
- **Coverage no longer depends on the prerender crawler.** Posts and projects that link out externally were never crawled, so their detail pages were not prerendered; every document is baked now regardless.
- `@ntatoud/content` gained `vite` as a devDependency and two subpath exports (`./vite`, `./virtual`); `apps/web` dropped `@ntatoud/effect-collections`, which it no longer imports.

## Trade-offs accepted

Content edits require a rebuild to appear. That was already true — content ships in the repo and Netlify purges its cache on deploy — and the plugin watches `content/` in dev, so `pnpm dev` still reflects edits immediately.

The build now does the content work once per document instead of once per prerendered page. `vite build` is unchanged in practice (the reads are milliseconds); what moved is _when_ the cost is paid, not how much of it there is.

`virtual:content`'s types live in a hand-written `packages/content/virtual.d.ts` rather than being inferred. It names the readers' own return types instead of restating them, so it cannot drift from the schemas, but adding a collection means adding a declaration.
