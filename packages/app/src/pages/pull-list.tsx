import React from 'react'
import Link from 'next/link'

import { Head } from 'components/Head'
import { Tiles } from 'components/Tiles'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { usePullList } from 'hooks/usePullList'
import { token } from 'lib/tokens'

const Home = () => {
  const { pullList } = usePullList()
  return (
    <div className="stack">
      <Head title="PullList" />

      <Stack space="large">
        <Heading component="h1">PullList </Heading>
        <Tiles columns={2} space="large">
          {pullList
            ? pullList.list.map((comicSeries) => (
                <Link
                  key={comicSeries._id}
                  href="/comic-series/[id]"
                  as={`/comic-series/${comicSeries._id}`}
                >
                  <a>{comicSeries.title}</a>
                </Link>
              ))
            : null}
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
