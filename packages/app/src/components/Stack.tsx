import React, { forwardRef, Children } from 'react'
import clsx from 'clsx'
import css from 'styled-jsx/css'

import { token } from 'lib/tokens'

const { className, styles: staticStyles } = css.resolve`
  .stack::before {
    content: '';
    display: block;
    margin-top: calc(var(--stack-gap) * -1);
  }
  ul.stack,
  ol.stack {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .stack-item {
    padding-top: var(--stack-gap);
  }
`

type Component = 'div' | 'ul' | 'ol'
type Space = 'none' | 'small' | 'medium' | 'large'
const spaces: { [space in Space]: string | number } = {
  none: 0,
  small: token('spaceS'),
  medium: token('spaceM'),
  large: token('spaceL'),
}

export type StackProps = {
  /**
   * Component used to render the Stack.
   * @default 'div'
   */
  component?: Component
  /**
   * Spacing between the children of the Stack.
   * @default 'none'
   */
  space?: Space
  /**
   * The Stacks Content.
   * @default undefined
   */
  children?: React.ReactNode
}

export const Stack: React.FunctionComponent<StackProps> = ({
  component: Component = 'div',
  space = 'none',
  children,
}) => {
  const Item = Component === 'div' ? 'div' : 'li'

  return (
    <Component className={clsx(className, 'stack')}>
      {Children.map(children, (child) => (
        <Item className={clsx(className, 'stack-item')}>{child}</Item>
      ))}
      {staticStyles}
      <style jsx>
        {`
          .stack {
            --stack-gap: ${spaces[space]};
          }
        `}
      </style>
    </Component>
  )
}
