/**
 * Server-only plumbing for running `@ntatoud/effect-content` programs
 * (ADR-0006 / ADR-0007). Never import this module from client code: it pulls
 * in the Effect content engine (and, transitively, Shiki + the MDX
 * compiler), which must stay server-side. Collection-specific server
 * functions (e.g. `./blog`) are the only intended callers.
 */
import { createRequire } from 'node:module'
import * as path from 'node:path'

import { ContentConfig, ContentService } from '@ntatoud/effect-content'
import { notFound } from '@tanstack/react-router'

import { FileSystem, Path } from '@effect/platform'
import { NodeContext } from '@effect/platform-node'
import { Cause, Effect, Exit, Layer, ManagedRuntime, Option } from 'effect'

const require = createRequire(import.meta.url)

/**
 * Absolute path to `packages/content/content`, resolved via Node module
 * resolution against the `@ntatoud/content` workspace package rather than a
 * cwd- or bundle-location-relative guess: pnpm resolves the `@ntatoud/content`
 * specifier to its real package directory (`packages/content`, following the
 * workspace symlink) regardless of where this file itself ends up once the
 * app's server bundle is built, so its sibling `content` directory is a
 * reliable content root in both dev and prod. Revisit once #96 copies
 * content into the app's own static tree.
 */
const contentRoot = path.join(
  path.dirname(require.resolve('@ntatoud/content')),
  'content',
)

/**
 * A single, process-lifetime `ManagedRuntime` rather than a fresh
 * `Effect.provide` per call: `ContentService.Default` depends on
 * `HighlighterService.Default`, which spins up a real Shiki highlighter, and
 * `ContentService` keeps its own per-slug compiled-MDX memo (ADR-0006) in a
 * closure created when the Layer is built. Rebuilding the Layer per request
 * would recreate the highlighter every time and defeat that memo entirely.
 *
 * The engine depends on the abstract `FileSystem`/`Path` services rather than
 * `node:fs` directly; as the server-side runner, this is the edge where we
 * supply the concrete platform via `NodeContext.layer` (mirrors how the
 * package's own tests wire it — see `blog-readers.test.ts`).
 */
const contentRuntime = ManagedRuntime.make(
  ContentService.Default.pipe(
    Layer.provide(ContentConfig.layer(contentRoot)),
    Layer.provideMerge(NodeContext.layer),
  ),
)

/**
 * Runs a Content Effect program against the shared runtime. Resolves with
 * the success value; on a typed failure, throws the failure value itself
 * (`ContentNotFound` | `FrontmatterInvalid` | `CompileFailed`) so callers can
 * map by `_tag`. Defects (bugs, unexpected throws) rethrow as a plain `Error`
 * carrying the Cause's pretty-printed trace.
 *
 * `R` includes `FileSystem`/`Path` (not just `ContentService`) because the
 * engine's readers surface those platform requirements in their return types;
 * the runtime above satisfies them via `NodeContext.layer`.
 */
export async function runContentProgram<A, E>(
  program: Effect.Effect<
    A,
    E,
    ContentService | FileSystem.FileSystem | Path.Path
  >,
): Promise<A> {
  const exit = await contentRuntime.runPromiseExit(program)
  if (Exit.isSuccess(exit)) return exit.value

  const failure = Cause.failureOption(exit.cause)
  if (Option.isSome(failure)) throw failure.value

  throw new Error(Cause.pretty(exit.cause))
}

function isTagged(error: unknown): error is { _tag: string } {
  return typeof error === 'object' && error !== null && '_tag' in error
}

/**
 * Maps `ContentNotFound` to a router `notFound()`; rethrows everything else
 * (`FrontmatterInvalid`, `CompileFailed`, defects) as-is for the nearest
 * route `errorComponent` (ADR-0006 / ADR-0007). Shared by every collection's
 * server-fn seam (blog, projects, and future collections, issue #95/#97).
 */
export function rethrowContentError(error: unknown): never {
  if (isTagged(error) && error._tag === 'ContentNotFound') {
    throw notFound()
  }
  throw error
}
