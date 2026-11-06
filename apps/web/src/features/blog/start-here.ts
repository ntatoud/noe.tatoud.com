import { blogPosts } from 'virtual:content'

export const startHerePost =
  blogPosts.find((post) => post.startHere) ?? blogPosts[0]
