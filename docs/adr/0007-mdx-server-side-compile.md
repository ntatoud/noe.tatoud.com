# ADR-0007: MDX is rendered server-side and shipped as a compiled function-body string

**Status:** accepted — supersedes [ADR-0004](./0004-mdx-rendering-stays-in-app.md).

A Document's MDX body is compiled on the server (at prerender, or on demand) with `@mdx-js/mdx` using `outputFormat: 'function-body'`. The result is a **serializable string**, so it can cross the server-function boundary that [ADR-0006](./0006-effect-content-pipeline.md) introduces. The app turns it back into React with `run()` plus a **component map** (custom `img`, internal `a` → TanStack `Link`, code block, and embedded components such as `ProjectCta`). The remark/rehype chain — GFM, `rehype-pretty-code` (Shiki, single `github-dark` theme), and in-pipeline image-dimension stamping — runs **server-side only**, so neither Shiki nor the MDX compiler ships to the browser; the client ships just the small `run` runtime.

## Why

The content is authored in-repo (first-party), so evaluating compiled MDX is safe, and full MDX keeps authoring open-ended — any component can be dropped into a post. Compiling to a string (the `next-mdx-remote` / `mdx-bundler` pattern) is the only shape of MDX that survives serialization through a request-time server function.

## Considered options

- **Build-time Vite MDX compile** (the scaffolded `@mdx-js/rollup` path). Rejected: keeps rendering in the app's bundler (ADR-0004) rather than behind the content engine, and doesn't compose with the request-time server-function model.
- **Emit hast JSON + `hast-util-to-jsx-runtime`.** Rejected: lighter payload, but limits authors to a curated component/directive set. We chose open-ended MDX.
- **Markdown-only + `remark-directive`** for custom components. Rejected for the same reason.

## Consequences

- MDX compilation is memoized (in-memory, keyed by `slug + file mtime`); prerendering makes production static, so the compiler effectively never runs in production.
- The app gains a tiny client dependency (`run` from `@mdx-js/mdx`) and a shared component map; `apps/web/vite.config.ts` loses its MDX plugin and rehype/remark chain.
