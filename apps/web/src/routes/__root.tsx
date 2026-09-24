import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import frauncesLatin from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url'
import manropeLatin from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'

import { ErrorPage } from '@/components/error/error-page'
import { NotFound } from '@/components/error/not-found'
import { BASE_META_TAGS, toMetaTags } from '@/features/og/metadata'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { FEEDS, FEED_TITLE, STATIC_PAGES } from '@/lib/site'

import appCss from '@/styles/index.css?url'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,

  head: () => ({
    meta: [
      ...BASE_META_TAGS,
      ...toMetaTags({
        title: STATIC_PAGES.home.title,
        description: STATIC_PAGES.home.description,
        path: STATIC_PAGES.home.path,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preload',
        href: manropeLatin,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: frauncesLatin,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      ...Object.values(FEEDS).map((feed) => ({
        rel: 'alternate',
        type: feed.type,
        title: `${FEED_TITLE} (${feed.label})`,
        href: feed.path,
      })),
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')!=='light')}catch(e){}",
          }}
        />
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-lg border border-ring bg-background px-4 py-2 text-foreground outline-none ring-ring/50 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:ring-3"
        >
          Skip to content
        </a>
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
