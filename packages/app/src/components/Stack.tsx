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
  ({ space }) =>
    css`
      ${responsiveProps<Space>(
        space,
        'none',
        (s) => `--stack-gap: ${spaces[s]};`,
      )}
      ${stack}
    `,
)
