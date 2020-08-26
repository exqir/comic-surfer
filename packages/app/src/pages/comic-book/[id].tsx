import React from 'react'
import { useRouter } from 'next/router'
import {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from 'next'

import Head from '../../components/head'
import Nav from '../../components/nav'
import { query, fetcher } from '../../hooks/useComicBook'

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ['1'].map((id) => ({
    params: { id },
  }))

  return { paths, fallback: true }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (params && params.id) {
    const data = await fetcher(query, params.id as string)
    const comicBook = data.comicBook

    return {
      props: {
        comicBook: comicBook ?? null,
      },
    }
  }

  return {
    props: { comicBook: null },
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
      <Nav />

      <div className="hero">
        <h1 className="title">Welcome to Next!</h1>
        <p className="description">
          To get started, edit the <code>pages/index.js</code> or{' '}
          <code>pages/api/date.js</code> files, then save to reload.
        </p>

        <div className="card">
          <h2>
            {comicBook.title} - {comicBook.issueNo}
          </h2>
          <img
            src={comicBook.coverImgUrl ?? undefined}
            alt={comicBook.title}
            width="180"
            height="276"
          />
        </div>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
        }
        .title,
        .description {
          text-align: center;
        }
        .row {
          max-width: 880px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        @keyframes Loading {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .date .loading {
          max-width: 100%;
          height: 24px;
          border-radius: 4px;
          display: inline-block;
          background: linear-gradient(270deg, #d1d1d1, #eaeaea);
          background-size: 200% 200%;
          animation: Loading 2s ease infinite;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  )
}

export default ComicBook
