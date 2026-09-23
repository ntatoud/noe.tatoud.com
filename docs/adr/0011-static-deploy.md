# ADR-0011: the site deploys as static files only

Netlify publishes `apps/web/dist/client` and nothing else, plus the markdown-negotiation edge function (ADR-0009). There is no serverless function: `@netlify/vite-plugin-tanstack-start` is removed, and with it the catch-all `server.mjs` handler it generated, `netlify.toml`'s `[functions]` block and `pnpm-workspace.yaml`'s `publicHoistPattern`.

## Why

**Nothing needs a request-time server any more.** ADR-0008 baked content into the bundle, and every page is prerendered from the list `@ntatoud/content/pages` provides. ADR-0010 moved OG images to build time. The feeds and the sitemap are server routes, but the prerender pass runs them once and writes their output to files. The only thing left for the function was rendering 404s.

**A function for 404s still costs a cold start.** The handler was a `path: "/*"` catch-all with `preferStatic: true`, so Netlify invoked it for every URL without a file: mistyped links, scanners probing for `/wp-admin`, stale links to removed pages. Each could pay a cold start (ADR-0008 measured 6.9 s) to render a page that never changes.

**The packaging existed only for the function.** `included_files` shipped the Linux `@takumi-rs/core` binary into the Lambda, and `publicHoistPattern` existed only to put that binary at a predictable path in the root `node_modules`. Neither is needed once no image is rendered at request time. Takumi still runs at build time, resolved normally from `packages/effect-og`.

## What changed

- **`404` is a prerendered page.** `apps/web/src/routes/404.tsx` renders the same `NotFound` component the root route uses, with `noindex`. `vite.config.ts` lists it in `pages` with `outputPath: '/404.html'`, and Netlify serves that file, with status 404, for any path that has no file.
- **The build output is unchanged.** Removing the plugin left the file list under `dist/client` identical, hashed asset names included. The plugin only added the function; it never shaped the static output.
- **`check:static` guards the shape.** `apps/web/scripts/check-static.ts` now requires `404.html` and fails if `apps/web/.netlify/v1/functions` exists, so a reintroduced function cannot slip in unnoticed.

## Consequences

- **A route that is not prerendered does not exist in production.** A new server route, or a page nothing links to, works in `pnpm dev` and is a 404 once deployed unless it is in `pages` in `vite.config.ts` (content documents are added automatically through `readContentPages`). `check:static` catches the pages the sitemap lists, the feeds and the OG images; anything else relies on review.
- **`/404` is also a real page at `/404`**, served with status 200 and `noindex`. Harmless.
- **The prerender patch stays.** `patches/@tanstack__start-plugin-core@1.171.40.patch` binds the prerender preview server to `127.0.0.1`, and prerendering still runs on Netlify's build image.
- **The App runtime (`apps/web/src/server/runtime.ts`) only runs during the build**, for the feed routes.

## Escape hatch

If a feature ever needs code at request time (a form handler, an authenticated page), re-add `@netlify/vite-plugin-tanstack-start` to `apps/web`'s devDependencies and to the Vite config's plugins, drop the `.netlify/v1/functions` entry from `check:static`, and supersede this ADR. The catch-all handler comes back with `preferStatic: true`, so every prerendered file keeps being served statically. If the function needs a native module, it also needs the packaging this ADR removed: `included_files` in `netlify.toml` and a `publicHoistPattern` that puts the binary where `included_files` looks.
