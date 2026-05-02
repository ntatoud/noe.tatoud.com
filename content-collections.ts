import * as fs from 'node:fs'
import * as path from 'node:path'

import { defineCollection, defineConfig } from '@content-collections/core'
import { imageSize } from 'image-size'

import { BlogPostSchema } from './src/features/blog/schemas'
import { ExperienceSchema } from './src/features/experiences/schemas'
import { ProjectSchema } from './src/features/projects/schemas'
import { TalkSchema } from './src/features/talks/schemas'

const blogPosts = defineCollection({
  name: 'blogPosts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: BlogPostSchema,
  transform: (data) => {
    let heroDimensions: { width: number; height: number } | null = null
    if (data.hero) {
      try {
        const heroPath = path.resolve(
          'content/blog',
          data._meta.directory,
          data.hero.replace(/^\.\//, ''),
        )
        const { width, height } = imageSize(fs.readFileSync(heroPath))
        if (width && height) heroDimensions = { width, height }
      } catch {
        // hero file not found or unreadable
      }
    }
    return { ...data, heroDimensions }
  },
})

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.mdx',
  schema: ProjectSchema,
})

const experiences = defineCollection({
  name: 'experiences',
  directory: 'content/experiences',
  include: '**/*.mdx',
  schema: ExperienceSchema,
})

const talks = defineCollection({
  name: 'talks',
  directory: 'content/talks',
  include: '**/*.mdx',
  schema: TalkSchema,
})

export default defineConfig({
  content: [blogPosts, projects, experiences, talks],
})
