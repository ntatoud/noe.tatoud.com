import {
  Context,
  Effect,
  FileSystem,
  Path,
  Schema,
  SchemaGetter,
  SchemaIssue,
} from 'effect'
import { imageSize } from 'image-size'

/**
 * The absolute directory of the document currently being decoded. Provided
 * per-document by `Collections` so `Image` fields can resolve a path
 * relative to the file that referenced them.
 */
export class DocumentDirectory extends Context.Service<
  DocumentDirectory,
  string
>()('effect-collections/DocumentDirectory') {}

const ImageStruct = Schema.Struct({
  path: Schema.String,
  width: Schema.Number,
  height: Schema.Number,
})

export type ImageValue = (typeof ImageStruct)['Type']

const readDimensions = (relativePath: string) =>
  Effect.gen(function* () {
    const directory = yield* DocumentDirectory
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const absolutePath = path.join(directory, relativePath)
    const bytes = yield* fs
      .readFile(absolutePath)
      .pipe(
        Effect.mapError(
          (cause) =>
            new SchemaIssue.InvalidValue(
              { message: String(cause) },
              relativePath,
            ),
        ),
      )
    const { width, height } = yield* Effect.try({
      try: () => imageSize(bytes),
      catch: (cause) =>
        new SchemaIssue.InvalidValue({ message: String(cause) }, relativePath),
    })
    return { path: absolutePath, width, height }
  })

/**
 * Decodes a frontmatter image path (e.g. `hero.png`) into its pixel
 * dimensions, resolved relative to the containing document's directory.
 */
export const Image = Schema.String.pipe(
  Schema.decodeTo(ImageStruct, {
    decode: SchemaGetter.transformEffect(readDimensions),
    encode: SchemaGetter.transform((image: ImageValue) => image.path),
  }),
)
