declare module 'virtual:content' {
  import type {
    BlogPost,
    BlogPostDetail,
    ContentInventory,
    Experience,
    Project,
    ProjectDetail,
    StageItem,
    TalkDetail,
  } from '@ntatoud/content'

  export const blogPosts: ReadonlyArray<BlogPost>
  export const projects: ReadonlyArray<Project>
  export const experiences: ReadonlyArray<Experience>
  export const talks: ReadonlyArray<StageItem>

  export const loadBlogPost: Readonly<
    Record<string, (() => Promise<{ default: BlogPostDetail }>) | undefined>
  >
  export const loadProject: Readonly<
    Record<string, (() => Promise<{ default: ProjectDetail }>) | undefined>
  >
  export const loadTalk: Readonly<
    Record<string, (() => Promise<{ default: TalkDetail }>) | undefined>
  >

  export const contentInventory: ContentInventory
}
