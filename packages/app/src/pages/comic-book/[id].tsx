import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
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
import { Tiles } from 'components/Tiles'
import { Heading } from 'components/Heading'
import { ComicBook as ComicBookComponent } from 'components/ComicBook'

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
        <Heading as="h1" variant="h1">
          {comicBook.title} #{comicBook.issueNo}
        </Heading>
        <Stack align="center" space="large">
          <div className="card">
            <img
              className="cover"
              src={comicBook.coverImgUrl ?? undefined}
              alt={comicBook.title}
              width={160}
              height={245}
            />
          </div>
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
        <Tiles columns={{ default: 2, tablet: 4, desktop: 2 }} space="large">
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
