export const SITE_URL = process.env.URL || 'http://localhost:3000'

export function siteUrl(path: string) {
  return `${SITE_URL}${path}`
}
