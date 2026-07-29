export {
  getBlogPost,
  getBlogPosts,
  type BlogPost,
  type BlogPostDetail,
} from './readers/blog'
export { getExperiences, type Experience } from './readers/experiences'
export {
  getProject,
  getProjects,
  type Project,
  type ProjectDetail,
} from './readers/projects'
export {
  getTalk,
  getTalks,
  type StageItem,
  type TalkDetail,
} from './readers/talks'

// The failures every Reader above can raise. Re-exported here so the App can
// discriminate them (a missing document is a 404, anything else is a 500)
// without importing `@ntatoud/effect-collections` directly — this package stays
// the App's single content seam.
export { CollectionError, DocumentNotFound } from '@ntatoud/effect-collections'

export type { ExperienceFrontmatter } from './schemas/experiences'
export type { ProjectFrontmatter } from './schemas/projects'
export type {
  StageEvent,
  StageResource,
  StageFrontmatter,
} from './schemas/talks'
