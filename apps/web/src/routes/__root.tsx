import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { NotFound } from '@/components/error/not-found'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { buildOgMeta } from '@/lib/og-image'

import appCss from '@/styles/index.css?url'

const DEFAULT_TITLE = 'Noé Tatoud'
const DEFAULT_DESCRIPTION = 'Noé Tatoud | Software engineer.'

export const Route = createRootRoute({
  notFoundComponent: NotFound,

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: DEFAULT_TITLE },
      {
        name: 'description',
        content: DEFAULT_DESCRIPTION,
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'noe.tatoud.com' },
      ...buildOgMeta({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        path: '/',
      }),
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
        <Footer />
        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
