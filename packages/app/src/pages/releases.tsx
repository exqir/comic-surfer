import React from 'react'
import Link from 'next/link'

import { styled } from 'stitches.config'
import { Head } from 'components/Head'
import { ComicBook } from 'components/ComicBook'
import { Tiles } from 'components/Tiles'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { useReleases } from 'hooks/useReleases'

const Releases = () => {
  const { releases } = useReleases({ redirectTo: '/login' })

  const currentMonth = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
  }).format(new Date())

  return (
    <div className="page">
      <Head title={`Releases ${currentMonth}`} />

      <Stack space="large">
        <Heading as="h1" variant="h1">
          Releases <Month>{currentMonth}</Month>
        </Heading>
        <Tiles
          // @initial is not applied when it has the same value as another breakpoint
          // https://github.com/modulz/stitches/issues/896
          // To mitigate this we also set the value same value for s so it should apply
          // in most cases.
          columns={{ '@initial': 2, '@s': 2, '@m': 4, '@l': 2 }}
          space="large"
        >
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
    </div>
  )
}

export default Releases

const Month = styled('span', {
  color: '$primary',
  fontSize: '24px',
})
