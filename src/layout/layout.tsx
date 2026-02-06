import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { MobileNav } from '@/layout/mobile-nav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col overflow-x-hidden">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  )
}
