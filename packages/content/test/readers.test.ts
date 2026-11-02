import { Collections, CollectionsLive } from '@ntatoud/effect-collections'

import { expect, layer } from '@effect/vitest'
import { Effect } from 'effect'

import { blog } from '../catalog/blog.ts'
import { experiences as experiencesEntry } from '../catalog/experiences.ts'
import { projects as projectsEntry } from '../catalog/projects.ts'
import { talks as talksEntry } from '../catalog/talks.ts'

const splitImageUrl = (url: string) => {
  const at = url.lastIndexOf('/')
  return { prefix: url.slice(0, at + 1), file: url.slice(at + 1) }
}

const descending = (times: ReadonlyArray<number>) =>
  times.every((time, index) => index === 0 || times[index - 1]! >= time)

const asTimes = (dates: ReadonlyArray<string>) =>
  dates.map((date) => new Date(date).getTime())

// Runs against the real collections: assert pipeline invariants, not the contents of any one document.
layer(CollectionsLive)('content readers', (it) => {
  it.effect(
    'blog reader derives portable hero URLs and sorts newest first',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const posts = blog.reader(yield* collections.getAll(blog.collection))

        expect(posts.length).toBeGreaterThan(0)
        expect(posts.every((post) => post.published)).toBe(true)
        expect(posts.every((post) => post.url === `/blog/${post.slug}`)).toBe(
          true,
        )
        expect(descending(asTimes(posts.map((post) => post.date)))).toBe(true)

        const withHero = posts.filter((post) => post.hero !== null)
        expect(withHero.length).toBeGreaterThan(0)

        for (const post of withHero) {
          const { prefix, file } = splitImageUrl(post.hero!)
          expect(prefix).toBe(`/content/blog/${post.slug}/`)
          expect(file).toMatch(/^[^/]+\.\w+$/)
          expect(post.heroDimensions?.width).toBeGreaterThan(0)
          expect(post.heroDimensions?.height).toBeGreaterThan(0)
        }

        for (const post of posts.filter((post) => post.hero === null)) {
          expect(post.heroDimensions).toBeNull()
        }

        // Must stay `null`: an absent key would make every post look external.
        expect(posts.some((post) => post.externalUrl === null)).toBe(true)
        expect(posts.some((post) => typeof post.externalUrl === 'string')).toBe(
          true,
        )
        expect(posts.every((post) => post.externalUrl !== undefined)).toBe(true)
      }),
  )

  it.effect('experiences reader derives portable logo URLs, newest first', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const experiences = experiencesEntry.reader(
        yield* collections.getAll(experiencesEntry.collection),
      )

      expect(experiences.length).toBeGreaterThan(0)
      expect(descending(asTimes(experiences.map((exp) => exp.startDate)))).toBe(
        true,
      )

      const withLogo = experiences.filter((exp) => exp.logo !== null)
      expect(withLogo.length).toBeGreaterThan(0)

      for (const exp of withLogo) {
        const { prefix, file } = splitImageUrl(exp.logo!)
        expect(prefix).toBe(`/content/experiences/${exp.slug}/`)
        expect(file).toMatch(/^[^/]+\.\w+$/)
      }
    }),
  )

  it.effect(
    'projects reader returns only published projects, personal first',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const projects = projectsEntry.reader(
          yield* collections.getAll(projectsEntry.collection),
        )

        expect(projects.length).toBeGreaterThan(0)
        expect(projects.every((project) => project.published)).toBe(true)
        expect(projects.every((project) => project.slug.length > 0)).toBe(true)
        expect(
          projects.every(
            (project) => project.path === `/projects/${project.slug}`,
          ),
        ).toBe(true)

        const firstContribution = projects.findIndex(
          (project) => project.kind === 'contribution',
        )
        if (firstContribution !== -1) {
          expect(
            projects
              .slice(firstContribution)
              .every((project) => project.kind === 'contribution'),
          ).toBe(true)
        }
      }),
  )

  it.effect('talks reader sorts by the most recent event date', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const talks = talksEntry.reader(
        yield* collections.getAll(talksEntry.collection),
      )

      expect(talks.length).toBeGreaterThan(0)
      expect(talks.every((talk) => talk.slug.length > 0)).toBe(true)

      const latest = talks.map((talk) =>
        Math.max(0, ...asTimes(talk.events.map((event) => event.date))),
      )
      expect(descending(latest)).toBe(true)

      for (const talk of talks) {
        expect(
          descending(asTimes(talk.events.map((event) => event.date))),
        ).toBe(true)
        expect(talk.path).toBe(`/talks/${talk.slug}`)
      }
    }),
  )
})
