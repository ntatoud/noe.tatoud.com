import { Collections, CollectionsLive } from '@ntatoud/effect-collections'

import { expect, layer } from '@effect/vitest'
import { Effect } from 'effect'

import { blog } from '../catalog/blog.ts'
import { experiences as experiencesEntry } from '../catalog/experiences.ts'
import { projects as projectsEntry } from '../catalog/projects.ts'
import { talks as talksEntry } from '../catalog/talks.ts'

const getBlogPosts = blog.reader
const getExperiences = experiencesEntry.reader
const getProjects = projectsEntry.reader
const getTalks = talksEntry.reader
const blogPostsCollection = blog.collection
const experiencesCollection = experiencesEntry.collection
const projectsCollection = projectsEntry.collection
const talksCollection = talksEntry.collection

/**
 * Splits a derived public image URL into its directory prefix and filename, so
 * assertions can compare the prefix exactly rather than interpolating a slug
 * (which may contain regex metacharacters) into a pattern.
 */
const splitImageUrl = (url: string) => {
  const at = url.lastIndexOf('/')
  return { prefix: url.slice(0, at + 1), file: url.slice(at + 1) }
}

const descending = (times: ReadonlyArray<number>) =>
  times.every((time, index) => index === 0 || times[index - 1]! >= time)

const asTimes = (dates: ReadonlyArray<string>) =>
  dates.map((date) => new Date(date).getTime())

// These assertions run against the repo's real Content Collections, so they
// describe invariants of the pipeline rather than the contents of any one
// document — adding or editing content must not break them.
//
// Each collection is read once per test: splitting assertions across
// `it.effect` blocks would re-read and re-measure every image file.
layer(CollectionsLive)('content readers', (it) => {
  it.effect(
    'getBlogPosts derives portable hero URLs and sorts newest first',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const posts = getBlogPosts(
          yield* collections.getAll(blogPostsCollection),
        )

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

        // The App branches on `externalUrl` to decide whether a post links
        // off-site, so "no external link" must stay `null` — leaving the key
        // absent would make every post look external.
        expect(posts.some((post) => post.externalUrl === null)).toBe(true)
        expect(posts.some((post) => typeof post.externalUrl === 'string')).toBe(
          true,
        )
        expect(posts.every((post) => post.externalUrl !== undefined)).toBe(true)
      }),
  )

  it.effect('getExperiences derives portable logo URLs, newest first', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const experiences = getExperiences(
        yield* collections.getAll(experiencesCollection),
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

  it.effect('getProjects returns only published projects, personal first', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const projects = getProjects(
        yield* collections.getAll(projectsCollection),
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

  it.effect('getTalks sorts by the most recent event date', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const talks = getTalks(yield* collections.getAll(talksCollection))

      expect(talks.length).toBeGreaterThan(0)
      expect(talks.every((talk) => talk.slug.length > 0)).toBe(true)

      const latest = talks.map((talk) =>
        Math.max(0, ...asTimes(talk.events.map((event) => event.date))),
      )
      expect(descending(latest)).toBe(true)

      // Each talk's own events are newest first, so `events[0]` is the latest.
      for (const talk of talks) {
        expect(
          descending(asTimes(talk.events.map((event) => event.date))),
        ).toBe(true)
        expect(talk.path).toBe(`/talks/${talk.slug}`)
      }
    }),
  )
})
