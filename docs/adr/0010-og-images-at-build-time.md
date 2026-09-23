# ADR-0010: OG images are rendered at build time

Social cards used to come from `/api/og`, a server route that rendered whatever `title`, `description` and `kind` its query string carried. That route is gone. A Vite plugin, `apps/web/plugins/og-images.ts`, renders one PNG per page during the client build and emits it at a fixed path; the meta tags point at those files. No request renders an image any more.

## Why

**The endpoint was an open renderer.** It drew any text it was given on the site's branded card and served the result with `Cache-Control: public, immutable, max-age=31536000`. Anyone could mint a "noe.tatoud.com" card saying anything and have the CDN keep it for a year. Every distinct query string also cost a serverless invocation running a native image renderer, which is why the Linux `@takumi-rs/core` binary had to be shipped into the Lambda through `netlify.toml`'s `included_files`.

**The set of cards is known at build time.** A card only ever showed a page's title, description and kind, and every page is either one of the four static pages (home and the three listings) or a content document, which the build already enumerates (ADR-0008). There was never a card worth rendering on demand.

**The prerender pass cannot produce them.** TanStack Start's prerender reads every response with `res.text()`, which corrupts a binary body, so the PNGs are written by a plugin of their own rather than by prerendering `/api/og` URLs.

## What is emitted

One image per page, named by `ogImagePath` in `apps/web/src/lib/site.ts`: `/` becomes `/og/index.png`, `/blog` becomes `/og/blog.png`, `/blog/what-is-mcp` becomes `/og/blog/what-is-mcp.png`. The plugin and `toMetaTags` both go through that one function, so the file a tag points at and the file the build writes cannot disagree. `apps/web/scripts/check-static.ts` checks it after every CI build: each sitemap page must have its image, and the image must be a PNG.

The pages come from `STATIC_PAGES` (also in `site.ts`, shared with the listing routes' `head`) and `readContentPages()` from `@ntatoud/content/pages`, the same list that drives the prerender pass. Drafts get a card, just as they keep a page.

Fonts are still registered on Takumi's `Renderer` through `@ntatoud/effect-og/image`'s `layer`. Passing them as a render option is a no-op in `takumi-js` v2.3.0, and the card silently falls back to the default face.

## Consequences

- **`/api/og` is deleted**, along with `features/og/og-image.ts` and `features/og/og-fonts.ts`. The plugin reads the woff2 files from disk at build time, so Vite's `?inline` embedding is no longer needed.
- **`OgImage` left the App runtime.** `apps/web/src/server/runtime.ts` provides only `Feed` now.
- **`defineOgMetadata` takes `imagePath: (pagePath) => string`** instead of an endpoint path and a list of kinds. `isOgKind`, `buildOgImageUrl` and the `kind` page input are gone: the badge is decided at build time, not by the URL.
- **`og-card.tsx` must stay loadable by the Vite config.** It is imported by `vite.config.ts` through the plugin, so it cannot use the `@/` alias or Vite-only imports. `OgKind` and `OG_FONT_FAMILY` live in it for that reason.
- **Knip's Vite plugin is off for `apps/web`.** It loads the config through a loader that cannot parse JSX; knip still follows the config's imports statically.
- **`/og/*` is cached for a day** (`public, max-age=86400`), not `immutable`: the file names are stable across deploys, so a retitled page has to be able to replace its image.
- **The cards look the same as before.** The build's `/og/blog/what-is-mcp.png` was byte-identical to what production's `/api/og` served for that post when this change was made.

## Trade-offs accepted

A page with no document and no `STATIC_PAGES` entry, such as `/styleguide`, has no card of its own: it inherits the root route's tags and therefore the home image. That is the right image for it, and adding an entry is all it takes to change that.

A changed title shows up on the card only on the next deploy. That was already true in effect, since the old URLs were cached `immutable` for a year.

Every build renders every card (14 today). If that ever grows expensive, the images can be cached by a hash of their inputs; nothing needs that yet.
