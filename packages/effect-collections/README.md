# effect-collections

A tiny, **content-agnostic** [Effect](https://effect.website) engine for MDX
content collections. You describe a collection with an Effect `Schema` and a
`toMetadata` mapping; you get back two fully-typed readers — `list` and `get` —
with server-side MDX compilation, static image resolution, a typed error
channel, and an in-memory compile cache.

It knows nothing about blogs, projects, or any particular site. Everything
domain-specific lives in _your_ collection definitions.

## Install

```sh
pnpm add effect-collections
# peer dependency
pnpm add effect
```

You also provide a platform `FileSystem`/`Path` implementation at the edge — for
Node that is `NodeServices.layer` from `@effect/platform-node`.

## Define a collection

```ts
import { Effect, Schema } from 'effect'
import { defineCollection, makeReaders } from 'effect-collections'

const NoteFrontmatter = Schema.Struct({
  title: Schema.String,
  date: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(false)),
  ),
  cover: Schema.optional(Schema.String),
})

const notes = defineCollection({
  name: 'notes', // == directory under `contentRoot`
  schema: NoteFrontmatter,
  toMetadata: ({ slug, frontmatter, resolveImage }) =>
    Effect.gen(function* () {
      const cover = frontmatter.cover
        ? (yield* resolveImage(frontmatter.cover)).url
        : null
      return {
        slug,
        url: `/notes/${slug}`,
        title: frontmatter.title,
        date: frontmatter.date,
        published: frontmatter.published,
        cover,
      }
    }),
  include: (note) => note.published, // filter applied to `list`
  order: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
})

export const { list, get } = makeReaders(notes)
```

- `list` — `Effect<readonly Meta[], ContentNotFound | FrontmatterInvalid, Deps>`
  (list slugs → validate frontmatter → `toMetadata` → filter → sort).
- `get(slug)` — `Effect<Meta & { body: string }, … | CompileFailed, Deps>`
  (validate → `toMetadata` → compile body; memoized by slug + file mtime).

`toMetadata` receives `{ slug, frontmatter, assetBaseUrl, resolveImage, resolveLogo }`.
`resolveImage(ref)` yields `{ url, width, height }` (a public URL with stamped
dimensions); `resolveLogo(ref)` inlines the file as a base64 `data:` URL.

## Provide the Layers

`list`/`get` require `Deps = CollectionsConfig | HighlighterService | FileSystem | Path`:

```ts
import { NodeServices } from '@effect/platform-node'
import { Effect, Layer } from 'effect'
import { CollectionsConfig, HighlighterService } from 'effect-collections'

const AppLayer = Layer.mergeAll(
  CollectionsConfig.layer({
    contentRoot: '/abs/path/to/content',
    assetBaseUrl: '/content', // your public asset prefix — never hardcoded in the core
  }),
  HighlighterService.Default, // Shiki, `github-dark`; use `.layer(theme)` to change
  NodeServices.layer, // FileSystem + Path
)

const posts = await Effect.runPromise(list.pipe(Effect.provide(AppLayer)))
```

## Typed errors

Every failure is on the typed error channel (`import { … } from 'effect-collections'`):

- `ContentNotFound { collection, slug }` — no `index.mdx` for the requested slug.
- `FrontmatterInvalid { collection, slug, reason }` — frontmatter failed `Schema` decode.
- `CompileFailed { collection, slug, reason }` — the MDX body could not be compiled.

## Also exported

`resolveImage`, `resolveLogo`, `imageRefExists`, `isRelativeRef`, `assetUrl`,
`collectImageRefs`, `compileMdxBody`, `rehypeContentImages`, and the low-level
document source (`listSlugs`, `readDocument`, `documentMtime`).

## Packaging note

For zero-build workspace consumption, `exports`/`imports` currently point at the
TypeScript **source** (`./index.ts`, `#core/* → ./src/*.ts`) — so downstream
`typecheck`/`test`/`build` need no pre-build of this package. `pnpm build` emits
a full ESM `dist/` with `.d.ts` declarations via `tsconfig.build.json`. The final
step to publish a source-free artifact is to flip `exports` to `./dist/index.js`
(+ `./dist/index.d.ts`) and `imports` to `./dist/src/*.js`.
