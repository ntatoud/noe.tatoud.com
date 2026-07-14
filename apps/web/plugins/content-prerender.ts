import { NodeContext } from '@effect/platform-node'
import { Effect, Layer, ManagedRuntime } from 'effect'

/**
 * Imported by relative path, not the `@ntatoud/effect-content` package
 * specifier: this module is pulled into `vite.config.ts`'s own dependency
 * graph, which Vite bundles with a dedicated config-loader (esbuild/rolldown,
 * not the app's regular build pipeline) that externalizes any bare package
 * specifier and hands it to Node's native ESM resolver — which, unlike
 * Vite's bundler, requires explicit file extensions and cannot follow the
 * package's own extensionless internal imports (`./index.ts` -> `./src/errors`,
 * etc). A relative import instead stays inside the bundle and resolves the
 * same way the rest of the app already does.
 */
import {
  ContentConfig,
  ContentService,
  formatContentValidationIssue,
} from '../../../packages/effect-content/index.ts'

export type PrerenderPage = { readonly path: string }

/**
 * Build-time content gate (ADR-0006): validates every Document in every
 * collection (published or not) — invalid frontmatter, a missing referenced
 * image, un-compilable MDX — and, once the tree is clean, enumerates every
 * *published* Document's detail route to prerender, alongside the four list
 * routes and the home page.
 *
 * Runs once per `vite build`, against a throwaway `ManagedRuntime` built
 * directly from `@ntatoud/effect-content` — not the app's request-time
 * runtime in `src/lib/server/content-runtime.ts`, which only exists once the
 * server bundle it lives in has been built. `vite.config.ts` awaits this
 * before constructing the `tanstackStart()` plugin, so a broken Document
 * fails the build before the client/server bundles are even built, with one
 * line per problem naming the file (and, for frontmatter, the field).
 */
export async function prepareContentForBuild(
  contentRoot: string,
): Promise<Array<PrerenderPage>> {
  const runtime = ManagedRuntime.make(
    ContentService.Default.pipe(
      Layer.provide(ContentConfig.layer(contentRoot)),
      Layer.provideMerge(NodeContext.layer),
    ),
  )

  try {
    const issues = await runtime.runPromise(
      Effect.gen(function* () {
        const content = yield* ContentService
        return yield* content.validate()
      }),
    )

    if (issues.length > 0) {
      const message = [
        `Content validation failed — ${issues.length} issue${
          issues.length === 1 ? '' : 's'
        } found:`,
        '',
        ...issues.map(formatContentValidationIssue),
      ].join('\n')
      throw new Error(message)
    }

    const [posts, projects, talks, experiences] = await runtime.runPromise(
      Effect.gen(function* () {
        const content = yield* ContentService
        return yield* Effect.all([
          content.getBlogPosts(),
          content.getProjects(),
          content.getTalks(),
          content.getExperiences(),
        ])
      }),
    )

    return [
      { path: '/' },
      { path: '/blog' },
      ...posts.map((post): PrerenderPage => ({ path: post.url })),
      { path: '/projects' },
      ...projects.map(
        (project): PrerenderPage => ({ path: `/projects/${project.slug}` }),
      ),
      { path: '/talks' },
      ...talks.map((talk): PrerenderPage => ({ path: `/talks/${talk.slug}` })),
      { path: '/experiences' },
      ...experiences.map(
        (experience): PrerenderPage => ({
          path: `/experiences/${experience.slug}`,
        }),
      ),
    ]
  } finally {
    await runtime.dispose()
  }
}
