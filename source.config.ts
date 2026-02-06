import { applyMdxPreset, defineCollections } from 'fumadocs-mdx/config'
import { BlogPostSchema } from './src/features/blog/schemas'
import { ProjectSchema } from './src/features/projects/schemas'
import { TechEventSchema } from './src/features/events/schemas'

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: BlogPostSchema,
  mdxOptions: applyMdxPreset({
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  }),
})

export const projects = defineCollections({
  type: 'doc',
  dir: 'content/projects',
  schema: ProjectSchema,
  mdxOptions: applyMdxPreset({
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  }),
})

export const techEvents = defineCollections({
  type: 'doc',
  dir: 'content/events',
  schema: TechEventSchema,
})
