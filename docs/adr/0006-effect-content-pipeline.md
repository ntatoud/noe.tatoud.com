# ADR-0006: A custom Effect-based content pipeline replaces content-collections

**Status:** accepted — supersedes [ADR-0003](./0003-content-collections-plugin-ownership.md), amends [ADR-0002](./0002-package-exports-readers.md).

We are replacing `@content-collections/core` + `@content-collections/vite` with a hand-written, Effect-based pipeline. It is built as a **new package, `@ntatoud/effect-content`** (dir `packages/effect-content`), rather than by swapping the internals of `@ntatoud/content` — so the existing package and content-collections are **retained as a working backup** during migration. The new package reads content files, validates frontmatter with Effect's `Schema` (replacing valibot), and renders bodies — exposing this as **pure Effect programs** behind the reader names (`getBlogPosts`, `getBlogPost(slug)`, …). The package stays **framework-agnostic**: the app wraps each program in a TanStack `createServerFn` at a thin `@/lib/content` seam and runs it with `Effect.runPromise`. Execution is request-time, but content routes are **prerendered at build**, so production is static; a small in-memory memo (keyed by `slug + file mtime`) covers dev and client-side navigation. Broken content — invalid frontmatter, a missing referenced image, un-compilable MDX — **fails the build** (unpublished documents are filtered, not errors).

Removing the old pipeline (`@ntatoud/content`, content-collections, valibot) is a **deferred, separate step** taken only once `@ntatoud/effect-content` is verified in production; until then both coexist and the app imports the new one.

## Why

Effect gives us one cohesive pipeline with a typed error channel (`ContentNotFound`, `FrontmatterInvalid`, `CompileFailed`), composable file-read/validate/render steps, and reusable resources as Layers (e.g. the Shiki highlighter). content-collections instead couples us to its Vite plugin, a generated-artifact directory, and a `content-collections` import alias (all of ADR-0003) — machinery the new package simply doesn't use. The old package keeps that machinery working as a backup until a later cleanup removes it.

## Considered options

- **Keep content-collections.** Rejected: we want an Effect-native pipeline and to be rid of the generated-artifact/alias/plugin layer.
- **Put `createServerFn` inside the content package** (so call sites keep importing from `@ntatoud/content`, honoring ADR-0002 literally). Rejected: it couples the content engine to TanStack Start and relies on the server-function transform running reliably inside a workspace package. The framework-agnostic split is worth the ~5 changed import paths.

## Consequences

- The new package uses Effect `Schema`; valibot lives on only in the retained `@ntatoud/content` until that package is removed.
- The reader seam (ADR-0002) moves into the app, pointing at `@ntatoud/effect-content`; readers are now async (they were already `await`ed at every call site, so this is free).
- The new package has no Vite build step, no generated artifacts, and no `content-collections` alias; the old package's build machinery stays in the tree, unused by the app, as the backup.
- Content files (MDX + images) are **not** duplicated: `@ntatoud/effect-content` reads from the existing `packages/content/content/**` directory, so `@ntatoud/content` stays a functioning backup over the same source.
- Retaining two content packages temporarily may trip dead-code/lint checks (knip) — expect to ignore or exclude `@ntatoud/content` until the deferred cleanup.
- Rendering is a separate but linked decision — see [ADR-0007](./0007-mdx-server-side-compile.md).
