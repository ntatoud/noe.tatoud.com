import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineCollection } from '@ntatoud/effect-collections'

import { BlogPostSchema } from './schemas/blog'
import { ExperienceSchema } from './schemas/experiences'
import { ProjectSchema } from './schemas/projects'
import { StageItemSchema } from './schemas/talks'

const here = path.dirname(fileURLToPath(import.meta.url))

// Resolve the repo-root `content/` directory. Relying on the source-file
// location (`import.meta.url`) breaks once this module is bundled into a
// serverless function, where the emitted file no longer sits next to the
// content folder. Walk up from both the current working directory and the
// module location, returning the first ancestor that contains a `content/`
// directory. Falls back to the source-relative path for local dev safety.
const findContentRoot = () => {
  for (const start of [process.cwd(), here]) {
    let dir = start
    while (true) {
      const candidate = path.join(dir, 'content')
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        return candidate
      }
      const parent = path.dirname(dir)
      if (parent === dir) break
      dir = parent
    }
  }
  return path.resolve(here, '../../content')
}

const contentRoot = findContentRoot()

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
