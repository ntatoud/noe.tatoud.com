import { Data } from 'effect'

/** A requested Document does not exist on disk. */
export class ContentNotFound extends Data.TaggedError('ContentNotFound')<{
  readonly collection: string
  readonly slug: string
}> {}

/** A Document's frontmatter failed Schema validation. */
export class FrontmatterInvalid extends Data.TaggedError('FrontmatterInvalid')<{
  readonly collection: string
  readonly slug: string
  readonly reason: string
}> {}

/** A Document's MDX body could not be compiled. */
export class CompileFailed extends Data.TaggedError('CompileFailed')<{
  readonly collection: string
  readonly slug: string
  readonly reason: string
}> {}
