import type { ComponentProps } from 'react'

export const mdxComponents = {
  figure: ({
    children,
    ...props
  }: ComponentProps<'figure'> & {
    'data-rehype-pretty-code-figure'?: string
  }) => {
    if ('data-rehype-pretty-code-figure' in props) return <>{children}</>
    return <figure {...props}>{children}</figure>
  },
  pre: (props: ComponentProps<'pre'>) => (
    <div className="relative my-4 bg-border pixel-shadow clip-pixel-lg pixel-shadow-card pixel-shadow-x-4 before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[''] before:clip-pixel-lg">
      <pre
        {...props}
        className="!my-0 overflow-auto p-4 text-sm [&_code]:bg-transparent [&_code]:p-0"
      />
    </div>
  ),
}
