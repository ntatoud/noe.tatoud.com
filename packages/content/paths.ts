const trim = (pagePath: string) => pagePath.replace(/^\/+|\/+$/g, '')

export const ogImagePath = (pagePath: string): string =>
  `/og/${trim(pagePath) || 'index'}.png`

// Same rule as the edge function's route mapping.
export const markdownPath = (routePath: string): string =>
  routePath === '/' ? '/index.md' : `${routePath.replace(/\/+$/, '')}.md`

export const markdownFileName = (routePath: string): string =>
  markdownPath(routePath).slice(1)
