import type { FunctionComponent } from 'react'

import { styled } from 'stitches.config'
import { Waves } from 'components/Waves'

export const AnonymousUserLayout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Center>{children}</Center>
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
