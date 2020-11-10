import React from 'react'
import Link from 'next/link'

import { Head } from 'components/Head'
import { Tiles } from 'components/Tiles'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { ComicBook } from 'components/ComicBook'
import { usePullList } from 'hooks/usePullList'
import { token } from 'lib/tokens'

const Home = () => {
  const { pullList, isLoading } = usePullList()
  return (
    <div className="stack">
      <Head title="PullList" />

      <Stack space="large">
        <Heading component="h1">PullList </Heading>
        <Tiles columns={{ default: 2, tablet: 4, desktop: 2 }} space="large">
          {pullList ? (
            pullList.list.map((comicSeries) => (
              <Link
                key={comicSeries._id}
                href="/comic-series/[id]"
                as={`/comic-series/${comicSeries._id}`}
                passHref
              >
                <ComicBook {...comicSeries} issueNo={null} releaseDate={null} />
              </Link>
            ))
          ) : isLoading ? (
            <p>Loading</p>
          ) : (
            <p>
              You have nothing on your PullList yet. Start by seaching for a
              comic series and add it to your PullList.
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
