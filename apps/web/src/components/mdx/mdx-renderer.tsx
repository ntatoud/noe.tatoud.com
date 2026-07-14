import { Suspense, use, useMemo } from 'react'

import { run } from '@mdx-js/mdx'
import type { MDXModule } from 'mdx/types'
import * as jsxDevRuntime from 'react/jsx-dev-runtime'
import * as jsxRuntime from 'react/jsx-runtime'

import { mdxComponents } from './mdx-components'

// `run()` needs the JSX runtime it should render with; spreading both the
// production and dev runtimes covers `outputFormat: 'function-body'` output
// compiled either way (ADR-0007) without shipping the MDX compiler itself.
const runtimeOptions = {
  ...jsxRuntime,
  ...jsxDevRuntime,
  baseUrl: import.meta.url,
}

type MdxRendererProps = {
  /** A compiled `function-body` MDX string (ADR-0007). */
  body: string
}

function MdxContent({ body }: MdxRendererProps) {
  const modulePromise = useMemo(
    () => run(body, runtimeOptions) as Promise<MDXModule>,
    [body],
  )
  const { default: Content } = use(modulePromise)
  return <Content components={mdxComponents} />
}

/**
 * Turns a compiled MDX body back into React via `run()` from `@mdx-js/mdx`,
 * applying the shared component map. `run()` is async, so the actual content
 * renders inside a `Suspense` boundary — callers don't need their own.
 */
export function MdxRenderer({ body }: MdxRendererProps) {
  return (
    <Suspense fallback={null}>
      <MdxContent body={body} />
    </Suspense>
  )
}
