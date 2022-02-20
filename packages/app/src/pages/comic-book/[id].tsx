import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next'

import { styled } from 'stitches.config'
import {
  query as releasesQuery,
  fetcher as releasesFetcher,
} from 'data/getCurrentComicBookReleases'
import { query, fetcher } from 'data/getComicBook'
import { Head } from 'components/Head'
import { Stack } from 'components/Stack'
import { Tiles } from 'components/Tiles'
import { Heading } from 'components/Heading'
import { ComicBook as ComicBookComponent } from 'components/ComicBook'
import { Box, Card } from 'components'

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { releases } = await releasesFetcher(releasesQuery)

    const paths =
      releases?.map(({ _id }) => ({
        params: { id: _id },
      })) ?? []

    return { paths, fallback: true }
  } catch (error) {
    return { paths: [], fallback: true }
  }
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ id: string }>) => {
  try {
    const { comicBook } = await fetcher(query, params!.id)

    return {
      props: {
        comicBook: comicBook ?? null,
      },
    }
  } catch (error) {
    return {
      props: { comicBook: null },
    }
  }
}

const ComicBook = ({
  comicBook,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!comicBook) {
    return <div>Error...</div>
  }

  return (
    <div>
      <Head title={`${comicBook.title} - ${comicBook.issueNo}`} />
      <Box
        css={{
          marginTop: -16,
          marginLeft: -16,
          marginRight: -16,
          width: 'calc(100% + 32px)',
          height: 400,
          backgroundImage: `url(${comicBook.coverImgUrl})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <Stack space="large">
        <Card css={{ padding: '$m', marginTop: -64 }}>
          <Stack space="large">
            <Heading as="h1" variant="h1" css={{ fontSize: '2rem' }}>
              {comicBook.title} <IssueNumber>#{comicBook.issueNo}</IssueNumber>
            </Heading>
            {comicBook.releaseDate ? (
              <span>
                Release date:{' '}
                {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(comicBook.releaseDate))}
              </span>
            ) : null}
            {comicBook.comicSeries ? (
              <Link href={`/comic-series/${comicBook.comicSeries._id}`}>
                <a>Series</a>
              </Link>
            ) : null}
          </Stack>
        </Card>
        {comicBook.description ? (
          <Stack space="medium">
            <Heading>Description</Heading>
            <p
              dangerouslySetInnerHTML={{ __html: comicBook.description }}
              style={{ margin: 0 }}
            />
          </Stack>
        ) : null}
        <Heading>Other Issues</Heading>
        <Tiles
          // @initial is not applied when it has the same value as another breakpoint
          // https://github.com/modulz/stitches/issues/896
          // To mitigate this we also set the value same value for s so it should apply
          // in most cases.
          columns={{ '@initial': 2, '@s': 2, '@m': 4, '@l': 2 }}
          space="large"
        >
          {comicBook.comicSeries
            ? comicBook.comicSeries.singleIssues.map((comicBook) => (
                <Link
                  key={comicBook._id}
                  href="/comic-book/[id]"
                  as={`/comic-book/${comicBook._id}`}
                  passHref
                >
                  <ComicBookComponent {...comicBook} />
                </Link>
              ))
            : null}
        </Tiles>
      </Stack>
    </div>
  )
}

export default ComicBook

// TODO: Usage Image component instead of img tag
const Cover = styled('img', {
  borderRadius: '$m',
  overflow: 'hidden',
  border: '1px solid #cbd5e0',
})

const IssueNumber = styled('span', {
  fontWeight: 'normal',
  color: '$subtle',
  paddingLeft: '$s',
})
