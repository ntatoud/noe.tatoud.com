interface Position {
  line: number
  column: number
}

interface Comment {
  type: 'Line' | 'Block' | 'Shebang'
  value: string
  start: number
  loc: { start: Position; end: Position }
}

interface Context {
  sourceCode: { text: string; getAllComments(): Comment[] }
  report(descriptor: { loc: Comment['loc']; messageId: string }): void
}

const DIRECTIVE =
  /^[\s*]*(?:[@#]__|@ts-|@vite-ignore|@jsx|@license|@preserve|eslint-|oxlint-|prettier-|istanbul |c8 |v8 |vitest-environment|<reference )/

const isProse = (comment: Comment) =>
  comment.type !== 'Shebang' && !DIRECTIVE.test(comment.value)

const spansLines = (comment: Comment) =>
  comment.loc.end.line > comment.loc.start.line

const standsAlone = (text: string, comment: Comment) =>
  text
    .slice(text.lastIndexOf('\n', comment.start - 1) + 1, comment.start)
    .trim() === ''

export const oneLineComments = {
  meta: {
    type: 'suggestion' as const,
    docs: {
      description:
        'A comment is one line, kept for a why the code cannot show. Rename or restructure instead of explaining.',
    },
    messages: {
      multiline:
        'Comments are one line. Keep only the why the code cannot show, or rename/restructure so the code says it.',
    },
    schema: [],
  },
  create(context: Context) {
    const { text } = context.sourceCode
    let previous: Comment | undefined
    let reportedRun = false
    for (const comment of context.sourceCode.getAllComments()) {
      const isStandaloneLine =
        comment.type === 'Line' && standsAlone(text, comment)
      const isContinuation =
        isStandaloneLine &&
        previous?.loc.end.line === comment.loc.start.line - 1
      if (
        isProse(comment) &&
        (spansLines(comment) || (isContinuation && !reportedRun))
      ) {
        context.report({ loc: comment.loc, messageId: 'multiline' })
      }
      reportedRun = isContinuation
      previous = isStandaloneLine && isProse(comment) ? comment : undefined
    }
    return {}
  },
}
