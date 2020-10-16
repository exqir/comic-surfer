import React from 'react'
import clsx from 'clsx'
import css from 'styled-jsx/css'

import { token } from 'lib/tokens'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type Component = Variant | 'p' | 'span'
type TextAlignment = 'left' | 'center' | 'right'

type HeadingProps = {
  /**
   * HTML Tag used to render the Heading.
   */
  component: Component
  /**
   * Visual style of the Heading.
   * @default "component"
   */
  variant?: Variant
  /**
   * Horizontally align the Heading.
   * One of `left`, `center` and `right`.
   * @default undefined
   */
  align?: TextAlignment
  /**
   * Content
   * @default undefined
   */
  children: React.ReactNode
  [htmlAttributes: string]: any
}

export const Heading: React.FC<HeadingProps> = ({
  component: Component,
  variant = Component,
  align,
  children,
  ...htmlAttributes
}) => {
  return (
    <Component {...htmlAttributes} className={clsx('heading', variant, align)}>
      {children}
      <style jsx>{staticStyles}</style>
    </Component>
  )
}

const staticStyles = css`
  .heading {
    /* reset */
    margin: 0;

    /* typography */
    line-height: ${token('lineMedium')};
  }
  .heading.h1 {
    font-size: 3rem;
  }
  .heading.left {
    text-align: left;
  }
  .heading.center {
    text-align: center;
  }
  .heading.right {
    text-align: right;
  }
`
