import { createFileRoute } from '@tanstack/react-router'

const BASE_URL = 'https://noe.tatoud.com'
const CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
const LINK_HEADER =
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"'

function buildApiCatalog(): string {
  return `${JSON.stringify(
    {
      linkset: [
        {
          anchor: `${BASE_URL}/.well-known/api-catalog`,
          item: [
            {
              href: `${BASE_URL}/api/og`,
              type: 'image/png',
            },
          ],
        },
        {
          anchor: `${BASE_URL}/api/og`,
          describedby: [
            {
              href: `${BASE_URL}/llms.txt`,
              type: 'text/plain',
            },
          ],
        },
      ],
    },
    null,
    2,
  )}\n`
}

function response(body: BodyInit | null) {
  return new Response(body, {
    headers: {
      'Content-Type': CONTENT_TYPE,
      Link: LINK_HEADER,
    },
  })
}

export const Route = createFileRoute('/.well-known/api-catalog')({
  server: {
    handlers: {
      GET: () => response(buildApiCatalog()),
      HEAD: () => response(null),
    },
  },
})
