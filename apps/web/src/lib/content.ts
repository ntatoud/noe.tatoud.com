/**
 * App-side content reader seam (ADR-0006 amendment to ADR-0002).
 *
 * Every feature imports collection readers and content types from here,
 * never from `@ntatoud/content` directly. For now this simply re-exports
 * the existing readers unchanged — no behaviour change. Once the Effect
 * content pipeline lands, only this file changes; route loaders, page
 * components, and home slices stay untouched.
 */
export {
  getBlogPosts,
  type BlogPost,
  getExperiences,
  type Experience,
  getProjects,
  type Project,
  getTalks,
  type StageItem,
  type StageEvent,
} from '@ntatoud/content'
