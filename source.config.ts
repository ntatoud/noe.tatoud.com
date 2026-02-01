import { defineCollections } from 'fumadocs-mdx/config'
import { BlogPostSchema } from './src/features/blog/schemas'

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: BlogPostSchema,
})
