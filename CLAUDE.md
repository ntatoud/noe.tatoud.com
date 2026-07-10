# CLAUDE.md

<!-- Keep this file up to date. After completing a task, check if anything
     learned should be captured here (new patterns, gotchas, conventions). -->

## Project

Personal website & blog — **noe.tatoud.com**

## Stack

- **Framework**: TanStack Start v1.166 (React meta-framework) on Vite 7
- **React**: 19.3.0-canary
- **Styling**: Tailwind CSS 4, tw-animate-css, shadcn/tailwind.css
- **UI components**: shadcn/ui (base-nova style), custom pixel icons in `src/components/icons/`
- **Blog/MDX**: fumadocs-mdx with fumadocs-core, content in `content/`
- **Package manager**: pnpm
- **Formatting**: oxfmt (`pnpm run format`) — no semicolons, single quotes, trailing commas
- **Linting**: oxlint via `oxlint.config.ts` (`pnpm run lint`)
- **Testing**: Vitest + Testing Library + jsdom (`pnpm run test`)
- **Dead code**: knip (`pnpm run knip`)
- **Language**: TypeScript 5.9 (strict mode, noUnusedLocals, noUnusedParameters)

## Commands

```sh
pnpm run dev       # dev server on port 3000
pnpm run build     # production build (Netlify)
pnpm run check     # format check + oxlint fix
pnpm run test      # run vitest
pnpm run knip      # dead code detection
```

## Key paths

```
src/
  routes/          # TanStack Router file-based routes (auto-generates routeTree.gen.ts)
  features/        # feature modules: blog, events, home, achievements
  components/
    ui/            # shadcn/ui primitives
    icons/         # custom pixel SVG icon components
  layout/          # shared layout: header, footer, nav, hero, section
  lib/             # utils.ts (cn), source.ts (fumadocs loaders), format.ts (formatDate)
  styles/
    index.css      # Tailwind imports, CSS variables, fonts, theming
    utilities/     # @utility blocks: pixel-shadow, pixel-clip, pixel-animations
content/
  blog/<slug>/index.mdx     # blog posts
  events/<slug>/index.mdx    # tech events
source.config.ts   # fumadocs-mdx collection definitions (blogPosts, techEvents)
knip.config.ts     # dead code detection config
oxlint.config.ts   # linting config
```

## Path aliases

- `@/*` → `./src/*`
- `fumadocs-mdx:collections/*` → `.source/*` (auto-generated, do not edit `.source/`)

## Conventions

### Imports & code style

- Always use `@/` path alias for imports from `src/`.
- oxfmt handles formatting: no semicolons, single quotes, trailing commas, 80-char width.
- Import order: external deps → TanStack → `@/features/` → `@/components/` → `@/layout/` → `@/lib/`.

### Components

- UI primitives go in `src/components/ui/`; feature-specific components go in `src/features/<feature>/`.
- Custom icons are SVG components in `src/components/icons/` (pixel art style, not an icon library).
- Prefer small, focused components. Colocate related code within feature folders.
- Use `cn()` from `@/lib/utils` to merge classNames (clsx + tailwind-merge).
- Use `cva` from `class-variance-authority` for variant-based styling.
- Use `data-slot` attributes for styling hooks (shadcn pattern).

### Content & data

- Blog posts are MDX files in `content/blog/<slug>/index.mdx`.
- All MDX frontmatter is validated with Zod schemas (defined in each feature's `schemas.ts`).
- Server data fetching uses `createServerFn` from TanStack Start (see `get-*.ts` files in features).
- Fumadocs sources are loaded via `lib/source.ts` using `toFumadocsSource()` + `loader()`.

### Theming

- Dark mode only (body has `className="dark"`).
- Colors use oklch color space via CSS variables.
- Fonts: Atkinson Hyperlegible (body), loaded via `@fontsource/atkinson-hyperlegible` CSS import.

## Git hooks (lefthook)

- **pre-commit**: oxfmt formats staged files, auto-stages fixes.
- **pre-push**: oxlint + fumadocs type generation + tsc typecheck.

## CI (GitHub Actions)

Runs on push/PR to `main`: format check, lint, fumadocs type gen, typecheck.

## Deployment

- **Netlify** with TanStack Start plugin. Config in `netlify.toml`.
- Build output: `dist/`.
- Currently blocks search engine indexing (`X-Robots-Tag: noindex, nofollow`).

## Agent skills

### Issue tracker

GitHub issues (via `gh` CLI). External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five canonical triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` at repo root, ADRs in `docs/adr/`. See `docs/agents/domain.md`.
