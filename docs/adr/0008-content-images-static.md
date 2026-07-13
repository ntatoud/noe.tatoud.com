# ADR-0008: Content images are served as static files under `/content`

**Status:** accepted.

Content images live colocated with their Documents in `packages/content/content/**`. At build, the whole content asset tree is copied into `apps/web/public/content/**` and served at stable URLs — `/content/<collection>/<slug>/<file>` — optionally through the Netlify Image CDN for responsive, format-negotiated delivery. Both **frontmatter refs** (`hero`, `logo`) and **body refs** (`![](./x.png)`) resolve by the same rule: a path relative to the Document's directory becomes `/content/<collection>/<slug>/<path>`. The pipeline reads each file with `image-size` and **stamps `width`/`height`** to prevent layout shift. Tiny logos remain inlined as base64 data-URLs.

## Why

The deployment is already set up for this: `netlify.toml` carries a `/content/*` cache rule and a Netlify Image CDN block. Serving images statically keeps them out of the client JS bundle and unlocks on-the-fly optimization — neither of which the previous Vite `import.meta.glob` approach did.

## Considered options

- **Vite `import.meta.glob` → content-hashed `/assets/*` URLs** (the old `content-images.ts`). Rejected: bundles every content image into the client build and bypasses the Netlify Image CDN.

## Consequences

- Replaces three mechanisms at once — `rehype-img-dimensions`, `rehype-mdx-import-media`, and the content-collections `transform` image helpers (`getHeroDimensions`, `encodeLogoDataUrl`); `apps/web/src/lib/content-images.ts` is removed.
- Content-image URLs are **not** content-hashed; cache-busting relies on the `/content/*` cache header (short TTL) rather than immutable hashed filenames.
