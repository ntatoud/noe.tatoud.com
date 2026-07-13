import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { NotFound } from '@/components/error/not-found'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'

import appCss from '@/styles/index.css?url'

export const Route = createRootRoute({
  notFoundComponent: NotFound,

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Noé Tatoud' },
      {
        name: 'description',
        content: 'Noé Tatoud | Software engineer.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="dark flex min-h-full flex-col">
        <Header />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
