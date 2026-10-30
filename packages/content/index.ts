// The app reads content from `virtual:content` (ADR-0008), so this entry only
// carries the types its pages are written against. The Content Catalog itself
// runs at build time, read by `snapshot.ts`.
export type { BlogPost, BlogPostDetail } from './catalog/blog.ts'
export type { Experience } from './catalog/experiences.ts'
export type { Project, ProjectDetail } from './catalog/projects.ts'
export type { StageItem, TalkDetail } from './catalog/talks.ts'
export type { PageKind } from './catalog/index.ts'
export type { ContentPages } from './pages.ts'

export type { ProjectCtaFrontmatter } from './schemas/projects.ts'
export type { StageResource } from './schemas/talks.ts'
