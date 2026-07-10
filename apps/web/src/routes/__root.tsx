import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '@/styles/index.css?url'

export const Route = createRootRoute({
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        This page doesn't exist or has been moved.
      </p>
    </main>
  ),

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
        content: 'Noé Tatoud — Software engineer.',
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
      <body className="dark">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
