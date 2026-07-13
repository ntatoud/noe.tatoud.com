# ADR-0002: Package exports reader functions, not raw collections

The content package (`@ntatoud/content`) exports typed reader functions (e.g., `getBlogPosts()`) rather than raw generated artifacts or bare types. A future migration to a custom Effect-based content pipeline is planned; readers provide a stable API seam so the package internals can be swapped without app changes.

> **Update (Effect migration — [ADR-0006](./0006-effect-content-pipeline.md)):** The reader _concept_ stands, but the seam moved into the app. The package now exports pure Effect programs; the app wraps them in `createServerFn` at `@/lib/content`. So call sites import readers from the app, not from `@ntatoud/content` — the "no app changes" promise is bent to keep the content engine framework-agnostic (a `createServerFn` inside a workspace package can't be relied on to be transformed).
