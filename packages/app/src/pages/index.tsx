import React from 'react'
import NextHead from 'next/head'

import { Head } from 'components/Head'
import { token } from 'lib/tokens'

const redirectScript = `
  document.cookie && document.cookie.indexOf('authenticated') > -1 && location.replace('/releases')
`

const Home = () => {
  return (
    <div className="stack">
      <NextHead>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </NextHead>
      <Head title="Home" />

      <div className="hero">
        <h1 className="title">Home</h1>
      </div>
      <style jsx>{`
        .stack > * + * {
          margin-top: ${token('spaceL')};
        }
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 48px;
        }
      `}</style>
    </div>
  )
}

export default Home
