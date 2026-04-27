import { useEffect, useState } from 'react'

import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { PageError } from '@/components/page-error'
import { Layout } from '@/layout/layout'
import '@/lib/content-images'
import appCss from '@/styles/index.css?url'

export const Route = createRootRoute({
  notFoundComponent: () => (
    <PageError
      code="404"
      title="Page not found"
      description="This page doesn't exist or has been moved."
    />
  ),

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
      {
        name: 'description',
        content:
          'Noe Tatoud - Software engineer. I build web apps and write about things I find interesting.',
      },
      { name: 'theme-color', content: '#000000' },
      {
        name: 'google-site-verification',
        content: '51070d23f73e75a0',
      },
    ],
    links: [
      { rel: 'preconnect', href: '/.netlify' },
      {
        rel: 'preload',
        href: '/fonts/GeistPixel-Square.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: appCss,
        as: 'style',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
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
        <Layout>{children}</Layout>
        {import.meta.env.DEV && <DevTools />}
        <Scripts />
      </body>
    </html>
  )
}

async function loadDevTools() {
  const [{ TanStackDevtools }, { TanStackRouterDevtoolsPanel }] =
    await Promise.all([
      import('@tanstack/react-devtools'),
      import('@tanstack/react-router-devtools'),
    ])
  return { TanStackDevtools, TanStackRouterDevtoolsPanel }
}

function DevTools() {
  const [tools, setTools] = useState<Awaited<
    ReturnType<typeof loadDevTools>
  > | null>(null)

  useEffect(() => {
    loadDevTools().then(setTools)
  }, [])

  if (!tools) return null

  const { TanStackDevtools, TanStackRouterDevtoolsPanel } = tools
  return (
    <TanStackDevtools
      config={{ position: 'bottom-right' }}
      plugins={[
        { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
      ]}
    />
  )
}
