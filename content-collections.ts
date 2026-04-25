import { defineCollection, defineConfig } from '@content-collections/core'

import { BlogPostSchema } from './src/features/blog/schemas'
import { ExperienceSchema } from './src/features/experiences/schemas'
import { ProjectSchema } from './src/features/projects/schemas'

const blogPosts = defineCollection({
  name: 'blogPosts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: BlogPostSchema,
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

export default defineConfig({
  content: [blogPosts, projects, experiences],
})
