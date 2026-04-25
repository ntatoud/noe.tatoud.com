import React from 'react'

export type MDXComponentType = React.ComponentType<{
  components?: Record<string, React.ComponentType>
}>

type MDXModule = { default: MDXComponentType }

export function createLazyMDXLoader(
  modules: Record<string, () => Promise<unknown>>,
) {
  const cache: Record<string, React.LazyExoticComponent<MDXComponentType>> = {}

  function getLazyMDX(path: string) {
    if (!cache[path]) {
      const loader = modules[path]
      if (!loader) return null
      cache[path] = React.lazy(loader as () => Promise<MDXModule>)
    }
    return cache[path]
  }

  function preload(path: string) {
    const loader = modules[path]
    if (loader) return loader()
  }

  return Object.assign(getLazyMDX, { preload })
}
