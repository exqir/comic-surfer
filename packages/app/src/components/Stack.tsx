import { styled } from 'stitches.config'

export const Stack = styled('div', {
  /* reset list styles in case a ul or ol is used */
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '$$space',
  alignItems: '$$align',

  variants: {
    /**
     * Alignment of the children of the Stack.
     * @default undefined
     */
    align: {
      left: { $$align: 'flex-start' },
      center: { $$align: 'center' },
      right: { $$align: 'flex-end' },
    },
    /**
     * Spacing between the children of the Stack.
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
