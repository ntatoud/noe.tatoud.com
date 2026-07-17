import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineCollection } from '@ntatoud/effect-collections'

import { BlogPostSchema } from './schemas/blog'
import { ExperienceSchema } from './schemas/experiences'
import { ProjectSchema } from './schemas/projects'
import { StageItemSchema } from './schemas/talks'

const here = path.dirname(fileURLToPath(import.meta.url))
const contentRoot = path.resolve(here, '../../content')

export const blogPosts = defineCollection({
  name: 'blogPosts',
  directory: path.join(contentRoot, 'blog'),
  schema: BlogPostSchema,
})

export const projects = defineCollection({
  name: 'projects',
  directory: path.join(contentRoot, 'projects'),
  schema: ProjectSchema,
})

export const experiences = defineCollection({
  name: 'experiences',
  directory: path.join(contentRoot, 'experiences'),
  schema: ExperienceSchema,
})

export const talks = defineCollection({
  name: 'talks',
  directory: path.join(contentRoot, 'talks'),
  schema: StageItemSchema,
})
