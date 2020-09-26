import React from 'react'
import { useRouter } from 'next/router'
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next'

import { Head } from 'components/Head'
import { query, fetcher } from 'data/getComicBook'
import { token } from 'lib/tokens'

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [].map((id) => ({
    params: { id },
  }))

  return { paths, fallback: true }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  try {
    const data = await fetcher(query, params!.id as string)
    const comicBook = data.comicBook

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

      <div className="hero">
        <h1 className="title">
          {comicBook.title} #{comicBook.issueNo}
        </h1>
        <div className="card">
          <img
            className="cover"
            src={comicBook.coverImgUrl ?? undefined}
            alt={comicBook.title}
            width="180"
            height="276"
          />
          <span>
            {comicBook.releaseDate
              ? new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(comicBook.releaseDate))
              : null}
          </span>
        </div>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 48px;
        }
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
