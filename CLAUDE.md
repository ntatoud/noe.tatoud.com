# CLAUDE.md

<!-- TODO: Keep this file up to date. After completing a task, check if anything
     learned should be captured here (new patterns, gotchas, conventions). -->

## Project

Personal website & blog — **noe.tatoud.com**

## Stack

- **Framework**: TanStack Start (React meta-framework) on Vite 7
- **React**: 19 (canary)
- **Styling**: Tailwind CSS 4, tw-animate-css
- **UI components**: shadcn/ui (base-nova style, hugeicons icon library)
- **Blog/MDX**: fumadocs-mdx with fumadocs-core, content lives in `content/blog/`
- **Package manager**: bun
- **Formatting**: oxfmt (`bun run format`)
- **Linting**: ESLint (`bun run lint`)
- **Testing**: Vitest + Testing Library (`bun run test`)
- **Language**: TypeScript (strict mode)

## Key paths

- `src/routes/` — TanStack Router file-based routes
- `src/features/` — feature modules (blog, home, …)
- `src/components/ui/` — shadcn/ui primitives
- `src/layout/` — shared layout components (header, footer, nav, hero)
- `src/lib/` — utilities (`utils.ts`, `source.ts`)
- `content/blog/` — MDX blog posts
- `source.config.ts` — fumadocs-mdx collection config

## Path aliases

- `@/*` → `./src/*`

## Commands

```sh
bun run dev       # dev server on port 3000
bun run build     # production build
bun run check     # format check + lint fix
bun run test      # run tests
```

## Conventions

- Use `@/` path alias for imports from `src/`.
- UI primitives go in `src/components/ui/`; feature-specific components go in `src/features/<feature>/`.
- Blog posts are MDX files in `content/blog/<slug>/index.mdx`.
- Prefer small, focused components. Colocate related code within feature folders.
