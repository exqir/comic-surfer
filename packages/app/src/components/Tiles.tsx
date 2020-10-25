// based on: https://github.com/seek-oss/braid-design-system/blob/master/lib/components/Tiles/Tiles.tsx
import React, { Children } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import clsx from 'clsx'
// import css from 'styled-jsx/css'

import { responsiveProps, ResponsiveProp } from 'lib/responsiveProps'
import { token } from 'lib/tokens'

const tiles = css`
  &.tiles::before {
    content: '';
    display: block;
    margin-top: calc(var(--tile-gap) * -1);
  }
  .tiles-display {
    display: flex;
    flex-wrap: wrap;
    margin-left: calc(var(--tile-gap) * -1);
  }
  .tile {
    flex: 0 0 var(--tile-width);
  }
  .tile-space {
    padding-top: var(--tile-gap);
    padding-left: var(--tile-gap);
  }
`

type Columns = 1 | 2 | 3 | 4 | 5 | 6
type Space = 'none' | 'small' | 'medium' | 'large'
const spaces: { [space in Space]: string | number } = {
  none: 0,
  small: token('spaceS'),
  medium: token('spaceM'),
  large: token('spaceL'),
}

export type TilesProps = {
  /**
   * Columns used to render the Tiles.
   * @default 1
   */
  columns?: ResponsiveProp<Columns>
  /**
   * Spacing between the children of the Tiles.
   * @default 'none'
   */
  space?: Space
  /**
   * Additional classes
   * @default undefined
   */
  className?: string
  /**
   * The Tiles Content.
   * @default undefined
   */
  children?: React.ReactNode
}

export const Tiles: React.FC<TilesProps> = styled<React.FC<TilesProps>>(
  ({ className, children }) => {
    return (
      <div className={clsx('tiles', className)}>
        <div className={clsx('tiles-display', className)}>
          {Children.map(children, (child) => (
            <div className={clsx('tile', className)}>
              <div className={clsx('tile-space', className)}>{child}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
)(
  ({ columns, space }) => css`
    ${responsiveProps<Columns>(columns, 1, (c) => `--tile-width: ${100 / c}%;`)}
    ${responsiveProps<Space>(space, 'none', (s) => `--tile-gap: ${spaces[s]};`)}
    ${tiles}
  `,
)
