import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineCollection, defineConfig } from '@content-collections/core'

import { encodeLogoDataUrl, getHeroDimensions } from './lib/images'
import { BlogPostSchema } from './schemas/blog'
import { ExperienceSchema } from './schemas/experiences'
import { ProjectSchema } from './schemas/projects'
import { StageItemSchema } from './schemas/talks'

const packageRoot = path.dirname(fileURLToPath(import.meta.url))

function resolveContentFile(
  collectionDir: string,
  directory: string,
  relativePath: string,
): string {
  return path.resolve(
    packageRoot,
    collectionDir,
    directory,
    relativePath.replace(/^\.\//, ''),
  )
}

const blogPosts = defineCollection({
  name: 'blogPosts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: BlogPostSchema,
  transform: (data) => {
    let heroDimensions: { width: number; height: number } | null = null
    if (data.hero) {
      heroDimensions = getHeroDimensions(
        resolveContentFile('content/blog', data._meta.directory, data.hero),
      )
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
  transform: (data) => {
    let logo: string | null = data.logo ?? null
    if (data.logo) {
      logo = encodeLogoDataUrl(
        resolveContentFile(
          'content/experiences',
          data._meta.directory,
          data.logo,
        ),
      )
    }
    return { ...data, logo }
  },
})

const talks = defineCollection({
  name: 'talks',
  directory: 'content/talks',
  include: '**/*.mdx',
  schema: StageItemSchema,
})

export default defineConfig({
  content: [blogPosts, projects, experiences, talks],
})
