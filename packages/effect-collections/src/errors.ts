import { Data } from 'effect'

export class ContentNotFound extends Data.TaggedError('ContentNotFound')<{
  readonly collection: string
  readonly slug: string
}> {}

export class FrontmatterInvalid extends Data.TaggedError('FrontmatterInvalid')<{
  readonly collection: string
  readonly slug: string
  readonly reason: string
}> {}

export class CompileFailed extends Data.TaggedError('CompileFailed')<{
  readonly collection: string
  readonly slug: string
  readonly reason: string
}> {}
