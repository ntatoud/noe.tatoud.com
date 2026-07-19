import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { NotFound } from '@/components/error/not-found'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BASE_META_TAGS, toMetaTags } from '@/features/og/metadata'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'

import appCss from '@/styles/index.css?url'

export const Route = createRootRoute({
  notFoundComponent: NotFound,

  head: () => ({
    meta: [
      ...BASE_META_TAGS,
      ...toMetaTags({
        title: 'Noé Tatoud',
        description: 'Noé Tatoud | Software engineer.',
        path: '/',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Noé Tatoud — Blog (RSS)',
        href: '/rss.xml',
      },
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'Noé Tatoud — Blog (Atom)',
        href: '/atom.xml',
      },
      {
        rel: 'alternate',
        type: 'application/feed+json',
        title: 'Noé Tatoud — Blog (JSON Feed)',
        href: '/feed.json',
      },
    ],
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
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
        </TooltipProvider>
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
