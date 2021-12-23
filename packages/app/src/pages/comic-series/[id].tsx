import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next'
import { responseInterface } from 'swr'
import styled from '@emotion/styled'

import { GetPullListQuery } from 'types/graphql-client-schema'
import { query, fetcher } from 'data/getComicSeries'
import { usePullList } from 'hooks/usePullList'
import { Head } from 'components/Head'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'
import { Tiles } from 'components/Tiles'
import { Card } from 'components/Card'
import { ComicBook } from 'components/ComicBook'
import { Button } from 'components/Button'
import { TopWave } from 'components/Waves'

import {
  query as subscribeQuery,
  fetcher as subscribeFetcher,
} from 'data/addToPullList'
import {
  query as unsubscribeQuery,
  fetcher as unsubscribeFetcher,
} from 'data/removeFromPullList'

const addToPullList = (
  url: string,
  mutate: responseInterface<GetPullListQuery, Error>['mutate'],
) => async () => {
  try {
    await subscribeFetcher(subscribeQuery, url)
    // TODO: instead of revalidating the pullList, use the return value from the mutation.
    // To make this work, the pullList and the mutation need to have the same data as the
    // data will not be merged, as it would in Apollo's cache.
    mutate()
  } catch (error) {}
}

const removeFromPullList = (
  id: string,
  mutate: responseInterface<GetPullListQuery, Error>['mutate'],
) => async () => {
  try {
    await unsubscribeFetcher(unsubscribeQuery, id)
    mutate()
  } catch (error) {}
}

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

const Center = styled.div`
  display: flex;
  justify-content: center;
`

type ComicSeriesProps = InferGetStaticPropsType<typeof getStaticProps> & {
  className?: string
}

const ComicSeries: React.FC<ComicSeriesProps> = ({
  comicSeries,
  className,
}) => {
  const router = useRouter()
  const { pullList, isLoading, mutate } = usePullList()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!comicSeries) {
    return <div>Error...</div>
  }

  return (
    <div className={className}>
      <Head title={`${comicSeries.title}`} />
      <TopWave />
      <Stack space="large">
        <Heading as="h1" variant="h1">
          {comicSeries.title}
        </Heading>
        <Stack align="center" space="large">
          {comicSeries.coverImgUrl ? (
            <Card>
              <img src={comicSeries.coverImgUrl} width={160} height={245} />
            </Card>
          ) : null}
          {isLoading ? (
            <Button isDisabled>Loading</Button>
          ) : pullList &&
            pullList.list.some(({ _id }) => _id === comicSeries._id) ? (
            <Button onClick={removeFromPullList(comicSeries._id, mutate)}>
              Unsubscribe
            </Button>
          ) : (
            <Button onClick={addToPullList(comicSeries.url, mutate)}>
              Subscribe
            </Button>
          )}
        </Stack>
        <Heading>Single Issues</Heading>
        <Tiles columns={{ default: 2, tablet: 4, desktop: 2 }} space="large">
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
        <Heading>Collections</Heading>
        <Tiles columns={{ default: 2, tablet: 4, desktop: 2 }} space="large">
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
    </div>
  )
}

export default ComicSeries
