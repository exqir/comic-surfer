import React from 'react'
import NextHead from 'next/head'

import { styled } from 'stitches.config'
import { redirectKey } from 'lib/redirect'
import { Head } from 'components/Head'
import { Heading } from 'components/Heading'

const redirectScript = `
  document.cookie && document.cookie.indexOf('authenticated') > -1 && location.replace('/releases')
`.trim()

const Home = () => {
  return (
    <div className="stack">
      <Head title="Home" />
      <NextHead>
        <script
          dangerouslySetInnerHTML={{ __html: redirectScript }}
          key={redirectKey}
        />
      </NextHead>

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
