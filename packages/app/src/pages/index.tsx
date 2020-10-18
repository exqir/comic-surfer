import React from 'react'
import NextHead from 'next/head'

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

      <div className="hero">
        <Heading component="h1">Home</Heading>
      </div>
      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
      `}</style>
    </div>
  )
}

export default Home
