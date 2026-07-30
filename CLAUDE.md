# CLAUDE.md

<!-- Keep this file up to date. After completing a task, check if anything
     learned should be captured here (new patterns, gotchas, conventions). -->

## Project

Personal website & blog — **noe.tatoud.com**

## Stack

- **Monorepo**: pnpm workspaces — `apps/web`, `packages/content`, `packages/effect-markdown`, `packages/effect-collections`
- **Framework**: TanStack Start (React meta-framework) on Vite
- **React**: 19
- **Styling**: Tailwind CSS 4, tw-animate-css, shadcn/ui (base-nova style)
- **Content**: `@ntatoud/effect-collections` (Effect `Schema` frontmatter + `@ntatoud/effect-markdown` markdown→HTML, no build/codegen step)
- **Package manager**: pnpm
- **Formatting**: oxfmt (`pnpm run format`) — no semicolons, single quotes, trailing commas
- **Linting**: oxlint via `oxlint.config.ts` (`pnpm run lint`)
- **Dead code**: knip (`pnpm run knip`)
- **Language**: TypeScript 7 (strict mode, noUnusedLocals, noUnusedParameters)

## Commands

```sh
pnpm run dev       # dev server (delegates to @ntatoud/web)
pnpm run build     # production build (delegates to @ntatoud/web)
pnpm run check     # format check + oxlint
pnpm run knip      # dead code detection
```

## Key paths

```
apps/web/              # @ntatoud/web — TanStack Start app
  src/
    routes/           # TanStack Router file-based routes
    features/         # feature modules (blog, projects, experiences, talks, home)
    components/       # shadcn/ui primitives, custom pixel icons
    layout/           # shared layout: header, footer, nav, hero, section
    lib/              # utils.ts (cn), format.ts, etc.
    styles/           # index.css, utilities/
  public/             # static assets
  src/server/         # createServerFn wrappers (filesystem-backed readers never run client-side)
packages/content/      # @ntatoud/content — content pipeline
  schemas/            # Effect Schema structs (one file per collection)
  readers/            # reader functions (typed data access)
  collections.ts      # collection definitions (@ntatoud/effect-collections)
packages/effect-markdown/     # @ntatoud/effect-markdown — markdown→HTML compiler (Effect service)
packages/effect-collections/  # @ntatoud/effect-collections — generic file-backed collections
content/              # MDX files (blog, projects, experiences, talks)
docs/
  adr/                # architectural decision records
  agents/             # agent skill configs
CONTEXT.md            # domain glossary
```

## Path aliases

- `@/*` → `./src/*` (inside `apps/web`)
- `@ntatoud/content` → workspace package
- `@ntatoud/web` → workspace package

## Conventions

### Imports & code style

- Use `@/` path alias for imports within the app.
- Use `@ntatoud/content` for reader functions and content types.
- oxfmt handles formatting: no semicolons, single quotes, trailing commas, 80-char width.

### Components

- UI primitives go in `apps/web/src/components/ui/`; feature-specific components go in `apps/web/src/features/<feature>/`.
- Use `cn()` from `@/lib/utils` to merge classNames (clsx + tailwind-merge).
- Use `cva` from `class-variance-authority` for variant-based styling.
- Use `data-slot` attributes for styling hooks (shadcn pattern).

### Content & data

- Content MDX files live in `content/<collection>/<slug>/index.mdx` at the repo root.
- All MDX frontmatter is validated with Effect `Schema` structs (defined in `packages/content/schemas/`).
- The content package exports reader functions (e.g., `getBlogPosts()`) — the app calls readers and never imports `@ntatoud/effect-collections` directly.
- Server data fetching uses `createServerFn` from TanStack Start.
- Detail readers (`getBlogPost(slug)`, etc.) return `html: string` — the body rendered by `@ntatoud/effect-markdown` (`@tanstack/markdown`). It's a plain string, so it crosses the `createServerFn` RPC boundary as-is; `apps/web/src/server/content.tsx`'s `withResolvedImages()` only rewrites relative image srcs. Detail pages display it via `dangerouslySetInnerHTML`.
- Code blocks are syntax-highlighted automatically by `@tanstack/highlight` (wired into `@ntatoud/effect-markdown`) — no per-page setup needed. The highlighter emits semantic `th-*` classes; the `github-dark` palette lives in `apps/web/src/styles/highlight.css`. A fence may carry `title="main.ts"` and a `{1,4,12-36}` line-highlight range. Languages are registered explicitly in `packages/effect-markdown/languages.ts` — add one there before using it in a fence, or it falls back to plaintext.
- **No custom components in content.** `@tanstack/markdown` does not evaluate JSX, so a content body is plain markdown (plus raw HTML, which is passed through untouched — `allowHtml`). Anything that needs a React component is driven from frontmatter and rendered by the page instead: see `cta` in `ProjectSchema` → `apps/web/src/features/projects/project-cta.tsx`.

### Theming

- Dark mode only (body has `className="dark"`).
- Colors use oklch color space via CSS variables.
- Fonts: Manrope (default, body + headings), loaded via `@fontsource/manrope` CSS import. Atkinson Hyperlegible Next is still imported and used as the mono font in blog code blocks (`--font-atkinson-next-light`, see `typeset.css`).

## Git hooks (lefthook)

- **pre-commit**: oxfmt formats staged files, auto-stages fixes.
- **pre-push**: oxlint + tsc typecheck.

## CI (GitHub Actions)

Runs on push/PR to `main`: format check, lint, typecheck.

## Deployment

- **Netlify** with TanStack Start plugin. Config in `netlify.toml`.
- Build output: `apps/web/dist/client`.

## Agent skills

### Issue tracker

GitHub issues (via `gh` CLI). External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five canonical triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` at repo root, ADRs in `docs/adr/`. See `docs/agents/domain.md`.
