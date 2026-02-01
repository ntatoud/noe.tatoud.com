import { applyMdxPreset, defineCollections } from 'fumadocs-mdx/config'
import { BlogPostSchema } from './src/features/blog/schemas'

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
