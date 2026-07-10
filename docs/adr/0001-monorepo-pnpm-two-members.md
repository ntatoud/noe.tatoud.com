# ADR-0001: Monorepo with pnpm — two members (apps/web + packages/content)

In-place restructure of the existing repo into a pnpm workspace. Two members: `apps/web` (TanStack Start) and `packages/content` (content collections + schemas + readers). Keeps git history and Netlify deployment. Starting minimal — shared config and UI packages can be extracted later when a second consumer justifies them.
