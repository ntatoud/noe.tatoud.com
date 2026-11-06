import { blogPosts } from 'virtual:content'

const START_HERE_SLUG = 'how-is-ai-changing-the-way-i-work-as-a-developer'

const post = blogPosts.find((candidate) => candidate.slug === START_HERE_SLUG)
if (!post) throw new Error(`Start-here post "${START_HERE_SLUG}" not found`)

export const startHerePost = post
