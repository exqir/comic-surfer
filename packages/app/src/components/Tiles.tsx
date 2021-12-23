import { styled } from 'stitches.config'

export const Tiles = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat($$columns, 1fr)',
  gap: '$$space',

  variants: {
    /**
     * Spacing between the children of the Tiles.
     * @default 'none'
     */
    space: {
      none: { $$space: 0 },
      small: { $$space: '$space$s' },
      medium: { $$space: '$space$m' },
      large: { $$space: '$space$l' },
    },
    /**
     * Columns used to render the Tiles.
     * @default 1
     */
    columns: {
      1: { $$columns: 1 },
      2: { $$columns: 2 },
      3: { $$columns: 3 },
      4: { $$columns: 4 },
      5: { $$columns: 5 },
      6: { $$columns: 6 },
    },
  },

  defaultVariants: {
    columns: '1',
    space: 'none',
  },
})
