import React from 'react'
import Link from 'next/link'

import Head from '../components/head'
import { Card } from '../components/Card'
import { useReleases } from '../hooks/useReleases'
import { token } from 'lib/tokens'

const Home = () => {
  const { releases } = useReleases({ redirectTo: '/login' })
  return (
    <div>
      <Head title="Home" />

      <div className="hero">
        <div className="row">
          <h1 className="title">
            Releases{' '}
            <span className="month">
              {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                new Date(),
              )}
            </span>
          </h1>
        </div>
        <div className="row">
          {releases
            ? releases.map((comicBook) => (
                <Link
                  key={comicBook._id}
                  href="/comic-book/[id]"
                  as={`/comic-book/${comicBook._id}`}
                >
                  <a>
                    <Card {...comicBook} />
                  </a>
                </Link>
              ))
            : null}
        </div>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 48px;
        }
        .month {
          color: ${token('colorPrimary')};
          font-size: 24px;
        }
        .row {
          max-width: 880px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
      `}</style>
    </div>
  )
}

export default Home
