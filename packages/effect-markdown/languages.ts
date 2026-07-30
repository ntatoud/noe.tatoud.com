import { createHighlighter } from '@tanstack/highlight/core'
import { css } from '@tanstack/highlight/languages/css'
import { diff } from '@tanstack/highlight/languages/diff'
import { html } from '@tanstack/highlight/languages/html'
import { js } from '@tanstack/highlight/languages/js'
import { json } from '@tanstack/highlight/languages/json'
import { jsx } from '@tanstack/highlight/languages/jsx'
import { markdown } from '@tanstack/highlight/languages/markdown'
import { plaintext } from '@tanstack/highlight/languages/plaintext'
import { shell } from '@tanstack/highlight/languages/shell'
import { toml } from '@tanstack/highlight/languages/toml'
import { ts } from '@tanstack/highlight/languages/ts'
import { tsx } from '@tanstack/highlight/languages/tsx'
import { yaml } from '@tanstack/highlight/languages/yaml'

/**
 * The grammars a code fence in this repo's content may ask for.
 *
 * TanStack Highlight bundles nothing implicitly — a language costs bundle size
 * only once it is listed here, and a fence tagged with anything absent falls
 * back to `plaintext` rather than throwing. Aliases resolve automatically, so
 * ```bash finds `shell` and ```typescript finds `ts`.
 */
export const highlighter = createHighlighter({
  fallbackLanguage: 'plaintext',
  languages: [
    css,
    diff,
    html,
    js,
    json,
    jsx,
    markdown,
    plaintext,
    shell,
    toml,
    ts,
    tsx,
    yaml,
  ],
})
