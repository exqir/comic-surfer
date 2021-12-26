import React from 'react'
import Link from 'next/link'

import { Head } from 'components/Head'
import { Tiles } from 'components/Tiles'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { ComicBook } from 'components/ComicBook'
import { usePullList } from 'hooks/usePullList'

const PullList = () => {
  const { pullList, isLoading } = usePullList()
  return (
    <div>
      <Head title="PullList" />

      <Stack space="large">
        <Heading as="h1" variant="h1">
          PullList{' '}
        </Heading>
        <Tiles
          // @initial is not applied when it has the same value as another breakpoint
          // https://github.com/modulz/stitches/issues/896
          // To mitigate this we also set the value same value for s so it should apply
          // in most cases.
          columns={{ '@initial': 2, '@s': 2, '@m': 4, '@l': 2 }}
          space="large"
        >
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
    </div>
  )
}

export default PullList
