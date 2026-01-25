import { useRender } from '@base-ui/react'

export function Text(props: useRender.ComponentProps<'p'>) {
  const { render, ...otherProps } = props

  const element = useRender({
    defaultTagName: 'p',
    render,
    props: otherProps,
  })

  return element
}
