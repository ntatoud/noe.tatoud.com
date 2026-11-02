// Types only: the catalog runs at build time (ADR-0008).
export type { BlogPost, BlogPostDetail } from './catalog/blog.ts'
export type { Experience } from './catalog/experiences.ts'
export type { Project, ProjectDetail } from './catalog/projects.ts'
export type { StageItem, TalkDetail } from './catalog/talks.ts'
export type { PageKind } from './catalog/index.ts'
export type { ContentInventory } from './pages.ts'

export type { ProjectCtaFrontmatter } from './schemas/projects.ts'
export type { StageResource } from './schemas/talks.ts'
