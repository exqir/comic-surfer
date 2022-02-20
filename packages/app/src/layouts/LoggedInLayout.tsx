import type { FunctionComponent } from 'react'

import { styled } from 'stitches.config'
import { Navigation } from 'components/Nav'
import { Waves } from 'components/Waves'

export const LoggedInLayout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Center>{children}</Center>
      <Navigation />
      <BottomSpacer />
      <Waves />
    </>
  )
}

const Center = styled('div', {
  position: 'relative',
  margin: '0 auto',
  maxWidth: '880px',
  padding: '$l',
})

const BottomSpacer = styled('div', {
  height: 'calc(50px + 2 * $space$l)',
})
