import React from 'react'
import { useRouter } from 'next/router'
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next'

import {
  query as releasesQuery,
  fetcher as releasesFetcher,
} from 'data/getCurrentComicBookReleases'
import { query, fetcher } from 'data/getComicBook'
import { token } from 'lib/tokens'
import { Head } from 'components/Head'
import { Stack } from 'components/Stack'
import { Heading } from 'components/Heading'

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
      <Stack space="large">
        <Heading component="h1">
          {comicBook.title} #{comicBook.issueNo}
        </Heading>
        <div className="card">
          <img
            className="cover"
            src={comicBook.coverImgUrl ?? undefined}
            alt={comicBook.title}
            width="180"
            height="276"
          />
        </div>
        <span>
          {comicBook.releaseDate
            ? new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).format(new Date(comicBook.releaseDate))
            : null}
        </span>
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

export default ComicBook
