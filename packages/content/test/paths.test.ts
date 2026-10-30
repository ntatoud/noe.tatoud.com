import { describe, expect, it } from 'vitest'

import { ogImagePath } from '../paths.ts'

describe('ogImagePath', () => {
  it('names the home card index.png', () => {
    expect(ogImagePath('/')).toBe('/og/index.png')
  })

  it('mirrors the page path under /og', () => {
    expect(ogImagePath('/blog')).toBe('/og/blog.png')
    expect(ogImagePath('/blog/what-is-mcp')).toBe('/og/blog/what-is-mcp.png')
  })

  it('ignores a trailing slash', () => {
    expect(ogImagePath('/blog/x/')).toBe('/og/blog/x.png')
  })
})
