import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next'

import { query, fetcher } from 'data/getComicSeries'
import { token } from 'lib/tokens'
import { Head } from 'components/Head'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { Tiles } from 'components/Tiles'
import { ComicBook } from 'components/ComicBook'

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ id: string }>) => {
  try {
    const { comicSeries } = await fetcher(query, params!.id)

    return {
      props: {
        comicSeries: comicSeries ?? null,
      },
    }
  } catch (error) {
    return {
      props: { comicSeries: null },
    }
  }
}

const ComicSeries = ({
  comicSeries,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!comicSeries) {
    return <div>Error...</div>
  }

  return (
    <div>
      <Head title={`${comicSeries.title}`} />
      <Stack space="large">
        <Heading component="h1">{comicSeries.title}</Heading>
        <Heading component="h2">Single Issues</Heading>
        <Tiles columns={2}>
          {comicSeries.singleIssues.map((comicBook) => (
            <Link
              key={comicBook._id}
              href="/comic-book/[id]"
              as={`/comic-book/${comicBook._id}`}
              passHref
            >
              <ComicBook {...comicBook} />
            </Link>
          ))}
        </Tiles>
        <Heading component="h2">Collections</Heading>
        <Tiles columns={2}>
          {comicSeries.collections.map((comicBook) => (
            <Link
              key={comicBook._id}
              href="/comic-book/[id]"
              as={`/comic-book/${comicBook._id}`}
              passHref
            >
              <ComicBook {...comicBook} />
            </Link>
          ))}
        </Tiles>
      </Stack>
      <style jsx>{`
        .cover {
          border-radius: ${token('borderRadius')};
          overflow: hidden;
          border: 1px solid #cbd5e0;
        }
      `}</style>
    </div>
  )
}

export default ComicSeries
