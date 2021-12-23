import { styled } from 'stitches.config'

export const Heading = styled('h2', {
  /* reset */
  margin: 0,
  /* typography */
  lineHeight: '$m',
  /* color */
  color: '$text',

  variants: {
    /**
     * Horizontally align the Heading.
     * One of `left`, `center` and `right`.
     * @default undefined
     */
    align: {
      left: { textAlign: 'left' },
      right: { textAlign: 'right' },
      center: { textAlign: 'center' },
    },
    /**
     * Visual style of the Heading.
     * @default undefined
     */
    variant: {
      h1: {
        fontSize: '3rem',
      },
    },
  },
})
