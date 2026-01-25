export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="flex w-full items-center justify-center">
        TODO HEADER
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="flex w-full items-center justify-center">
        TODO FOOTER
      </footer>
    </div>
  )
}
