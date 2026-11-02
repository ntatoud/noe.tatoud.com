import { RuleTester } from 'oxlint/plugins-dev'
import { describe, it } from 'vitest'

import { oneLineComments } from '../rules/one-line-comments.ts'

RuleTester.describe = describe
RuleTester.it = it

new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } }).run(
  'one-line-comments',
  oneLineComments,
  {
    valid: [
      '// A why the code cannot show.\nconst a = 1',
      '/* inline */ const a = 1',
      'const a = 1 // trailing\n// standalone\nconst b = 2',
      '// first\n\n// second, after a blank line\nconst a = 1',
      '/**\n * @license MIT\n */\nconst a = 1',
      '// @ts-expect-error\n// eslint-disable-next-line\nconst a: number = "x"',
    ],
    invalid: [
      {
        code: '/**\n * Narration\n * over two lines.\n */\nconst a = 1',
        errors: [{ messageId: 'multiline' }],
      },
      {
        code: '// A comment\n// that continues.\nconst a = 1',
        errors: [{ messageId: 'multiline', line: 2 }],
      },
      {
        code: '// One run\n// of three\n// lines.\nconst a = 1',
        errors: [{ messageId: 'multiline', line: 2 }],
      },
    ],
  },
)
