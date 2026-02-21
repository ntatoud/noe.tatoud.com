import { Suspense, lazy } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import { Layout } from '@/layout/layout'
import appCss from '@/styles.css?url'

// Devtools are lazy-loaded and only bundled in dev. In production
// import.meta.env.DEV is false, so Vite dead-code-eliminates the imports.
const TanStackDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-devtools').then((m) => ({
        default: m.TanStackDevtools,
      })),
    )
  : () => null

const TanStackRouterDevtoolsPanel = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtoolsPanel,
      })),
    )
  : () => null

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Noé Tatoud',
      },
      { name: 'theme-color', content: '#000000' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="dark">
        <RootProvider theme={{ enabled: false }}>
          <Layout>{children}</Layout>
          <Suspense>
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </Suspense>
          <Scripts />
        </RootProvider>
      </body>
    </html>
  )
}
