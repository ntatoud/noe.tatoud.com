export {
  type Collection,
  type CollectionAccessor,
  type CollectionDeps,
  type DefaultMeta,
  defineCollection,
  type FrontmatterSchema,
  makeCollections,
  makeReaders,
  type MetaOf,
  type Readers,
  type ResolvedFrontmatter,
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
  resolveImage,
  resolveLogo,
} from '#core/image'
export {
  Image,
  ImageRef,
  Logo,
  type ResolveImageRefs,
  resolveImageRefs,
} from '#core/image-schema'
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
