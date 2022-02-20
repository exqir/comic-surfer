import {
  gray,
  blue,
  red,
  green,
  amber,
  sand,
  whiteA,
  grayDark,
  blueDark,
  redDark,
  greenDark,
} from '@radix-ui/colors'
import { createStitches } from '@stitches/react'

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Semantic
      primary: amber.amber9,
      subtle: sand.sand8,
      text: sand.sand12,
      background: '#fff',
      bg: sand.sand2,

      // Palette
      ...whiteA,
    },
    space: {
      s: '4px',
      m: '8px',
      l: '16px',
      xl: '32px',
    },
    fontSizes: {
      m: '1rem',
    },
    lineHeights: {
      m: '1.5',
    },
    shadows: {
      s: '0 5px 10px rgba(0, 0, 0, 0.12)',
    },
    radii: {
      m: '5px',
    },
    zIndices: {
      bg: -1,
      modal: 900,
      max: 1000,
    },
  },
  media: {
    s: '(320px <= width < 720px)',
    m: '(720px <= width < 1024px)',
    l: '(1024px <= width)',
  },
})

export const srOnly = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
})
