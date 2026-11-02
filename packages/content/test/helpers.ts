import * as fs from 'node:fs'
import * as path from 'node:path'

import { expect } from 'vitest'

import { content } from '../vite.ts'

type Hook = (...args: any[]) => any

export function createPlugin() {
  const warnings: string[] = []
  const plugin = content() as unknown as {
    configResolved: Hook
    resolveId: Hook
    load: Hook
  }
  plugin.configResolved({ logger: { warn: (m: string) => warnings.push(m) } })

  const generate = async (id: string): Promise<string> => {
    const resolved = plugin.resolveId(id)
    expect(resolved, `plugin did not claim ${id}`).toBeTruthy()
    const code = await plugin.load(resolved)
    expect(code, `plugin generated nothing for ${id}`).toBeTruthy()
    return code as string
  }

  return { generate, warnings }
}

export const readDeclaredExports = (): ReadonlyArray<string> =>
  [
    ...fs
      .readFileSync(path.join(import.meta.dirname, '../virtual.d.ts'), 'utf8')
      .matchAll(/^\s*export const (\w+):/gm),
  ].map(([, name]) => name!)

export const PAGES = {
  home: { path: '/', title: 'Home', description: 'Home.' },
  blog: { path: '/blog', title: 'Blog', description: 'Posts.' },
  projects: { path: '/projects', title: 'Projects', description: 'Projects.' },
  talks: { path: '/talks', title: 'Talks', description: 'Talks.' },
}
