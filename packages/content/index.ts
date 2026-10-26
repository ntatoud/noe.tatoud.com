// The app reads content from `virtual:content` (ADR-0008), so this entry only
// carries the types its pages are written against. The readers themselves run
// at build time, imported by `snapshot.ts`.
export type { BlogPost, BlogPostDetail } from './readers/blog.ts'
export type { Experience } from './readers/experiences.ts'
export type { Project, ProjectDetail } from './readers/projects.ts'
export type { StageItem, TalkDetail } from './readers/talks.ts'

export type { ProjectCtaFrontmatter } from './schemas/projects.ts'
export type { StageResource } from './schemas/talks.ts'
