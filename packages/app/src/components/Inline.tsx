import { styled } from 'stitches.config'

export const Inline = styled('div', {
  // reset list styles in case a ul or ol is used
  listStyle: 'none',
  margin: 0,
  padding: 0,

  display: 'flex',
  gap: '$$space',
  alignItems: '$$align',
  justifyContent: '$$justify',

  variants: {
    /**
     * Vertical alignment of the children.
     * @default undefined
     */
    align: {
      left: { $$align: 'flex-start' },
      center: { $$align: 'center' },
      right: { $$align: 'flex-end' },
    },
    /**
     * Horizontal alignment of the children.
     * @default undefined
     */
    justify: {
      left: { $$justify: 'flex-start' },
      center: { $$justify: 'center' },
      right: { $$justify: 'flex-end' },
      between: { $$justify: 'space-between' },
      evenly: { $$justify: 'space-evenly' },
    },
    /**
     * Spacing between the children.
     * @default 'none'
     */
    space: {
      none: { $$space: 0 },
      small: { $$space: '$space$s' },
      medium: { $$space: '$space$m' },
      large: { $$space: '$space$l' },
    },
  },

  defaultVariants: {
    space: 'none',
  },
})
