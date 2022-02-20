import React from 'react'

import { styled } from 'stitches.config'
import { Head } from 'components/Head'
import { Heading } from 'components/Heading'

const Home = () => {
  return (
    <div>
      <Head title="Home" />

      <Hero>
        <Heading as="h1" variant="h1">
          Home
        </Heading>
      </Hero>
    </div>
  )
}

export default Home

const Hero = styled('div', {
  width: '100%',
  color: '#333',
})
