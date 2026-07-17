> Superseded by [ADR-0006](./0006-effect-collections-replaces-content-collections.md) — `content-collections` was replaced by `@ntatoud/effect-collections`.

# ADR-0003: Content-collections plugin config lives in the package, runs in the app's Vite

The `@content-collections/vite` plugin is configured by `@ntatoud/content` (schemas, collection definitions, output directory). The Vite build itself runs in `apps/web`, which includes the plugin pointing at the package's config. Generated artifacts live inside `packages/content/` and the `content-collections` import alias is scoped to the package's tsconfig — the app never imports generated artifacts directly, only via reader functions.

This keeps the content package self-contained while avoiding a two-phase build (content pre-build then app build). Vite is the only build orchestrator; the plugin regenerates artifacts on content changes during dev.
