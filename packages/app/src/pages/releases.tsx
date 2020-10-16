import React from 'react'
import Link from 'next/link'

import { Head } from 'components/Head'
import { Card, Card1, Card2, Card3, Card4 } from 'components/Card'
import { Heading } from 'components/Heading'
import { useReleases } from 'hooks/useReleases'
import { token } from 'lib/tokens'

const Home = () => {
  const { releases } = useReleases({ redirectTo: '/login' })
  return (
    <div className="stack">
      <Head title="Home" />

      <div className="hero">
        <Heading component="h1">
          Releases{' '}
          <span className="month">
            {new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(
              new Date(),
            )}
          </span>
        </Heading>
      </div>
      {/* <div className="row">
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
      <div className="row">
        {releases
          ? releases.map((comicBook) => (
              <Link
                key={comicBook._id}
                href="/comic-book/[id]"
                as={`/comic-book/${comicBook._id}`}
              >
                <a>
                  <Card1 {...comicBook} />
                </a>
              </Link>
            ))
          : null}
      </div>
      <div className="row">
        {releases
          ? releases.map((comicBook) => (
              <Link
                key={comicBook._id}
                href="/comic-book/[id]"
                as={`/comic-book/${comicBook._id}`}
              >
                <a className="w-full">
                  <Card2 {...comicBook} />
                </a>
              </Link>
            ))
          : null}
      </div>
      <div className="row">
        {releases
          ? releases.map((comicBook) => (
              <Link
                key={comicBook._id}
                href="/comic-book/[id]"
                as={`/comic-book/${comicBook._id}`}
              >
                <a className="w-full">
                  <Card3 {...comicBook} />
                </a>
              </Link>
            ))
          : null}
      </div> */}
      <div className="row">
        {releases
          ? releases.map((comicBook) => (
              <Link
                key={comicBook._id}
                href="/comic-book/[id]"
                as={`/comic-book/${comicBook._id}`}
              >
                <a>
                  <Card4 {...comicBook} />
                </a>
              </Link>
            ))
          : null}
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
        .month {
          color: ${token('colorPrimary')};
          font-size: 24px;
        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .row > *:nth-child(1n + 3) {
          margin-top: ${token('spaceL')};
        }
        .w-full {
          width: 100%;
        }
        a {
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

export default Home
