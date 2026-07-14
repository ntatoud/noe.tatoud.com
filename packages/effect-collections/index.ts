export {
  type Collection,
  type CollectionDefinition,
  type CollectionDeps,
  defineCollection,
  type FrontmatterSchema,
  makeReaders,
  type Readers,
  type ToMetadataArgs,
} from '#core/collection'
export { collectImageRefs } from '#core/collect-image-refs'
export { CollectionsConfig, type CollectionsConfigShape } from '#core/config'
export {
  CompileFailed,
  ContentNotFound,
  FrontmatterInvalid,
} from '#core/errors'
export { DEFAULT_THEME, HighlighterService } from '#core/highlighter'
export {
  assetUrl,
  imageRefExists,
  isRelativeRef,
  type ResolvedImage,
  type ResolvedLogo,
  resolveImage,
  resolveLogo,
} from '#core/image'
export { compileMdxBody, type CompileMdxOptions } from '#core/mdx'
export {
  rehypeContentImages,
  type RehypeContentImagesOptions,
} from '#core/rehype-content-images'
export {
  documentMtime,
  listSlugs,
  type RawDocument,
  readDocument,
} from '#core/source'
