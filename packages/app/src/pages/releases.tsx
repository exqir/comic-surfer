import React from 'react'
import Link from 'next/link'

import { Head } from 'components/Head'
import { ComicBook } from 'components/ComicBook'
import { Tiles } from 'components/Tiles'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { useReleases } from 'hooks/useReleases'
import { token } from 'lib/tokens'

const Home = () => {
  const { releases } = useReleases({ redirectTo: '/login' })

  const currentMonth = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
  }).format(new Date())

  return (
    <div className="page">
      <Head title={`Releases ${currentMonth}`} />

      <Stack space="large">
        <Heading component="h1">
          Releases <span className="month">{currentMonth}</span>
        </Heading>
        <Tiles columns={{ default: 2, tablet: 4, desktop: 2 }} space="large">
          {releases && releases.length > 0 ? (
            releases.map((comicBook) => (
              <Link
                key={comicBook._id}
                href="/comic-book/[id]"
                as={`/comic-book/${comicBook._id}`}
                passHref
              >
                <ComicBook {...comicBook} />
              </Link>
            ))
          ) : (
            <p>
              You have no releases on your{' '}
              <Link href="/pull-list">
                <a>PullList</a>
              </Link>{' '}
              this month.
            </p>
          )}
        </Tiles>
      </Stack>
      <style jsx>{`
        .month {
          color: ${token('colorPrimary')};
          font-size: 24px;
        }
      `}</style>
    </div>
  )
}

export default Home
