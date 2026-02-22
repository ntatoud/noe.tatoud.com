import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts } from '@/features/blog/get-blog-posts'
import { PageAchievements } from '@/features/achievements/page-achievements'

export const Route = createFileRoute('/achievements/')({
  loader: async () => {
    const posts = await getBlogPosts()
    return { totalBlogPosts: posts.length }
  },
  component: PageAchievements,
  head: () => ({
    meta: [{ title: 'Achievements | Noé Tatoud' }],
  }),
})
