# effect-collections

A tiny, **content-agnostic** [Effect](https://effect.website) engine for MDX
content collections. You describe a collection with an Effect `Schema`; you get
back two fully-typed readers — `list` and `get` — with server-side MDX
compilation, automatic image resolution, a typed error channel, and an
in-memory compile cache.

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

Declare image fields with the `Image`/`Logo` schema constructors. No
`toMetadata` is needed: the reader adds `slug`/`url` and resolves every image
field automatically.

```ts
import { Effect, Schema } from 'effect'
import { defineCollection, Image } from 'effect-collections'

const NoteFrontmatter = Schema.Struct({
  title: Schema.String,
  date: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(false)),
  ),
  // The raw frontmatter value is a `string` ref (`cover: ./cover.png`);
  // it decodes to an `ImageRef` and the reader resolves it to a
  // `ResolvedImage` = `{ src, width, height }`.
  cover: Schema.optional(Image),
})

export const notes = defineCollection({
  name: 'notes', // == directory under `contentRoot`
  schema: NoteFrontmatter,
  include: (note) => note.published, // filter applied to `list`
  order: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
})
```

Each Document's metadata is the image-resolved frontmatter plus `slug` and
`url` (`/${name}/${slug}`). Above, `note.cover` is typed as
`{ src, width, height } | undefined` — an absent optional image stays
`undefined`.

## Get ready-to-run readers with `makeCollections`

`makeCollections` is the primary entry point. Hand it a record of collections
and it returns an Effect that captures the dependency context **once** and
yields an accessor per key. The `list`/`get` on each accessor have their
requirement channel fully discharged (`R = never`), so consumers run them with
no per-call layer plumbing:

```ts
import { Effect } from 'effect'
import { makeCollections } from 'effect-collections'

const program = Effect.gen(function* () {
  const content = yield* makeCollections({ notes /* , posts, talks, … */ })

  const published = yield* content.notes.list() // Effect<readonly Meta[], …, never>
  const note = yield* content.notes.get('hello') // Effect<Meta & { body }, …, never>
  return { published, note }
})
```

- `.list()` — `Effect<readonly Meta[], ContentNotFound | FrontmatterInvalid>`
  (list slugs → validate + image-resolve frontmatter → filter → sort).
- `.get(slug)` — `Effect<Meta & { body: string }, … | CompileFailed>`
  (validate + resolve → compile body; memoized by slug + file mtime).

Run `makeCollections(...)` at a Layer boundary (e.g. `Layer.effect(MyService,
makeCollections({ notes }))`) so the context is captured once for the service's
lifetime. `makeReaders(collection)` is still exported if you want a single
collection's raw `list`/`get` (whose `R` is `CollectionDeps`) and to wire the
Layers yourself.

### Image fields

- `Image` — Encoded `string` ref → decoded `ImageRef` → resolved to a public
  `<assetBaseUrl>/<collection>/<slug>/<file>` URL (`kind: 'asset'`).
- `Logo` — same, but resolved to an inlined base64 `data:` URL (`kind:
'inline'`), for small logos that should avoid a request round-trip.

Both compose with optionality/nullability (`Schema.optional(Image)`, …) and are
resolved wherever they appear — top-level, in nested objects, and inside arrays
(e.g. `events: Schema.Array(Schema.Struct({ logo: Logo }))`). Resolution stamps
on-disk `width`/`height` (or `null` if the file cannot be read).

### Reshaping with `toMetadata` (optional)

For collections that need to reshape the resolved frontmatter into a different
public shape, pass a `toMetadata`. It receives the **already image-resolved**
frontmatter plus `{ slug, url }` and returns the final `Meta`; `include`/`order`
then operate on that shape.

```ts
const talks = defineCollection({
  name: 'talks',
  schema: TalkFrontmatter,
  toMetadata: ({ slug, url, frontmatter }) =>
    Effect.succeed({ slug, url, title: frontmatter.title /* … */ }),
})
```

## Provide the Layers

`makeCollections` (and the raw `makeReaders` readers) require
`CollectionDeps = CollectionsConfig | HighlighterService | FileSystem | Path`.
Provide the config, a platform layer (`NodeServices.layer` for Node), and
`HighlighterService` via a Layer, and inject them once at the `makeCollections`
boundary:

```ts
import { NodeServices } from '@effect/platform-node'
import { Effect, Layer } from 'effect'
import {
  CollectionsConfig,
  HighlighterService,
  makeCollections,
} from 'effect-collections'

const AppLayer = Layer.mergeAll(
  CollectionsConfig.layer({
    contentRoot: '/abs/path/to/content',
    assetBaseUrl: '/content', // your public asset prefix — never hardcoded in the core
  }),
  HighlighterService.Default, // Shiki, `github-dark`; use `.layer(theme)` to change
  NodeServices.layer, // FileSystem + Path
)

const program = Effect.gen(function* () {
  const content = yield* makeCollections({ notes })
  return yield* content.notes.list() // runs with no further environment
})

const posts = await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
```

## Typed errors

Every failure is on the typed error channel (`import { … } from 'effect-collections'`):

- `ContentNotFound { collection, slug }` — no `index.mdx` for the requested slug.
- `FrontmatterInvalid { collection, slug, reason }` — frontmatter failed `Schema` decode.
- `CompileFailed { collection, slug, reason }` — the MDX body could not be compiled.

## Also exported

`Image`, `Logo`, `ImageRef`, `resolveImageRefs`, `resolveImage`, `resolveLogo`,
`imageRefExists`, `isRelativeRef`, `assetUrl`, `collectImageRefs`,
`compileMdxBody`, `rehypeContentImages`, and the low-level document source
(`listSlugs`, `readDocument`, `documentMtime`). Types: `ResolvedImage`,
`ResolveImageRefs`, `DefaultMeta`, `ResolvedFrontmatter`, `ToMetadataArgs`,
`CollectionAccessor`, `MetaOf`, …

## Packaging note

For zero-build workspace consumption, `exports`/`imports` currently point at the
TypeScript **source** (`./index.ts`, `#core/* → ./src/*.ts`) — so downstream
`typecheck`/`test`/`build` need no pre-build of this package. `pnpm build` emits
a full ESM `dist/` with `.d.ts` declarations via `tsconfig.build.json`. The final
step to publish a source-free artifact is to flip `exports` to `./dist/index.js`
(+ `./dist/index.d.ts`) and `imports` to `./dist/src/*.js`.
