import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import {
  blogPosts,
  projects as projectsCollection,
} from 'fumadocs-mdx:collections/server'

export const blog = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogPosts, []),
})

export const projects = loader({
  baseUrl: '/projects',
  source: toFumadocsSource(projectsCollection, []),
})
