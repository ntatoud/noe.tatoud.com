# CLAUDE.md

<!-- Keep this file up to date. After completing a task, check if anything
     learned should be captured here (new patterns, gotchas, conventions). -->

## Project

Personal website & blog — **noe.tatoud.com**

## Stack

- **Monorepo**: pnpm workspaces — `apps/web`, `apps/demo`, `packages/content`, `packages/effect-mdx`, `packages/effect-collections`
- **Framework**: TanStack Start (React meta-framework) on Vite
- **React**: 19
- **Styling**: Tailwind CSS 4, tw-animate-css, shadcn/ui (base-nova style)
- **Content**: `@ntatoud/effect-collections` (Effect `Schema` frontmatter + `@ntatoud/effect-mdx` MDX→JSX, no build/codegen step)
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
packages/effect-mdx/    # @ntatoud/effect-mdx — MDX→JSX compiler (Effect service)
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

### Theming

- Dark mode only (body has `className="dark"`).
- Colors use oklch color space via CSS variables.
- Fonts: Atkinson Hyperlegible (body), loaded via `@fontsource/atkinson-hyperlegible` CSS import.

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
