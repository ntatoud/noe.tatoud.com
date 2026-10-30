# AGENTS.md

Personal site and blog, noe.tatoud.com. pnpm monorepo, TanStack Start on Vite, Effect, Tailwind 4, shadcn/ui. Scripts are in the root `package.json`; domain vocabulary in `CONTEXT.md`; decisions in `docs/adr/`.

## Code

- Code explains itself through names and structure. Write a comment only for a _why_ the code cannot show: a workaround, a hidden invariant, a coupling to another file. One line (enforced by `ntatoud/one-line-comments`; repo lint rules live in `packages/oxlint-plugin/`).
- External dependency versions live once in the `catalog` of `pnpm-workspace.yaml`; workspaces use `catalog:`.
- Relative imports inside `packages/**` carry an explicit `.ts` extension: the Vite config loads that graph through Node's ESM loader. `apps/web/src` stays extensionless (`routeTree.gen.ts` is generated that way).

## Content

- Documents live in `content/<collection>/<slug>/index.mdx`, plain markdown (the `.mdx` name is historical). Raw HTML passes through; JSX does not. Anything needing a component is driven from frontmatter and rendered by the page (see `cta` in `ProjectSchema`).
- The content is baked into the bundle at build time (ADR-0008). Pages read `virtual:content`, never the network. Listing routes have no loader; detail routes use `loadBlogPost` / `loadProject` / `loadTalk`. Image fields and body image srcs are already hashed asset URLs.
- A new collection is a module in `packages/content/catalog/`, listed in `catalog/index.ts`, declared in `packages/content/virtual.d.ts`, plus its app routes.
- A new code fence language must be registered in `packages/effect-markdown/languages.ts`.

## Static site

Production is only the files in `apps/web/dist/client` (ADR-0011): a route that is not prerendered is a 404 there. A page without a document goes into `STATIC_PAGES`, a server route into `FILE_ROUTES` (`apps/web/src/lib/site.ts`). `pnpm --filter @ntatoud/web check:static` after a build proves every page, OG image and markdown twin exists.

Every page has a markdown twin served on `Accept: text/markdown` (ADR-0009). The negotiation logic exists twice, in `packages/content/vite-markdown.ts` and `netlify/edge-functions/markdown-negotiation.ts` (Deno, deployed separately); change both.

## Design

Clay design system (see `CONTEXT.md`). Headings use Young Serif, single weight 400: never `font-semibold` or `font-bold` on them.

## Agent skills

Vendored from mattpocock/skills into `.claude/skills/`; update by re-copying, never reformat. Issues live on GitHub: `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`.
