// Where a page's derived files live. Pure and import-free, so the app's meta
// tags, the Vite config, `check:static` and the build plugins can all name a
// page's files through the same rules.

const trim = (pagePath: string) => pagePath.replace(/^\/+|\/+$/g, '')

/**
 * Where a page's social card lives: `/` → `/og/index.png`,
 * `/blog/what-is-mcp` → `/og/blog/what-is-mcp.png`. The build emits the files
 * (`plugins/og-images.ts`) and the meta tags point at them, both through this.
 */
export const ogImagePath = (pagePath: string): string =>
  `/og/${trim(pagePath) || 'index'}.png`

/**
 * The public URL of a page's markdown twin.
 *
 * One rule, mirrored by the edge function: a page at `/blog/foo` has its
 * markdown at `/blog/foo.md`, and the home page's lives at `/index.md`. Keeping
 * it derivable means the negotiating edge function needs a single fetch and no
 * manifest, and it leaves every `.md` URL fetchable by hand.
 */
export const markdownPath = (routePath: string): string =>
  routePath === '/' ? '/index.md' : `${routePath.replace(/\/+$/, '')}.md`

/** The same mapping as a build-output file name (no leading slash). */
export const markdownFileName = (routePath: string): string =>
  markdownPath(routePath).slice(1)
