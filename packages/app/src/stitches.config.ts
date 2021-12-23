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
      primary: '#f1c32d',
      text: '#1A202C',
      background: '#fff',
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
  },
  media: {
    s: '(min-width: 320px)',
    m: '(min-width: 720px)',
    l: '(min-width: 1024px)',
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
