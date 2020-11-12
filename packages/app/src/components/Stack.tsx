// based on: https://github.com/seek-oss/braid-design-system/tree/master/lib/components/Stack
import React, { Children } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import clsx from 'clsx'

import { responsiveProps, ResponsiveProp } from 'lib/responsiveProps'
import { token } from 'lib/tokens'

const stack = css`
  &.stack::before {
    content: '';
    display: block;
    margin-top: calc(var(--stack-gap) * -1);
  }

  /* reset list styles */
  ul&.stack,
  ol&.stack {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .stack-item {
    padding-top: var(--stack-gap);
    display: var(--stack-display);
    align-items: var(--stack-align);
  }
`

type Component = 'div' | 'section' | 'ul' | 'ol'
type Space = 'none' | 'small' | 'medium' | 'large'
const spaces: { [space in Space]: string | number } = {
  none: 0,
  small: token('spaceS'),
  medium: token('spaceM'),
  large: token('spaceL'),
}
type Align = 'left' | 'center' | 'right'
const alignments: { [align in Align]: string } = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}
const display: { [align in Align]: string } = {
  left: 'block',
  center: 'flex',
  right: 'flex',
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
  space?: ResponsiveProp<Space>
  /**
   * Alignment of the children of the Stack.
   * @default 'none'
   */
  align?: ResponsiveProp<Align>
  /**
   * Additional classes
   * @default undefined
   */
  className?: string
  /**
   * The Stacks Content.
   * @default undefined
   */
  children?: React.ReactNode
}

// TODO: respect hidden items, space should not be applied in this case
export const Stack: React.FC<StackProps> = styled<React.FC<StackProps>>(
  ({ component: Component = 'div', className, children }) => {
    const Item = ['ul', 'li'].includes(Component) ? 'li' : 'div'

    return (
      <Component className={clsx('stack', className)}>
        {Children.map(children, (child) => (
          <Item className={clsx('stack-item', className)}>{child}</Item>
        ))}
      </Component>
    )
  },
)(
  ({ space, align }) =>
    css`
      ${responsiveProps<Space>(
        space,
        'none',
        (s) => `--stack-gap: ${spaces[s]};`,
      )}
      ${responsiveProps<Align>(
        align,
        'left',
        (a) =>
          `--stack-align: ${alignments[a]}; --stack-display: ${display[a]};${
            a !== 'left' ? 'flex-direction: column;' : ''
          }`,
      )}
      ${stack}
    `,
)
