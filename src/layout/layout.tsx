import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import ClickSpark from '@/components/click-spark'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { MobileNav } from '@/layout/mobile-nav'

function ScrollToTop() {
  const router = useRouter()
  useEffect(() => {
    return router.subscribe('onResolved', () => {
      document.body.scrollTo(0, 0)
    })
  }, [router])
  return null
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <ClickSpark>
        <ScrollToTop />
        <Header />
        <main className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </ClickSpark>
    </div>
  )
}
