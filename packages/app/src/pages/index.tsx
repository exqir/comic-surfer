import React from 'react'
import Link from 'next/link'

import Head from '../components/head'
import { useReleases } from '../hooks/useReleases'

type CardProps = {
  _id: string
  title: string
  issueNo: string | null
  coverImgUrl: string | null
}
const Card: React.FC<CardProps> = ({ _id, title, issueNo, coverImgUrl }) => {
  return (
    <article className="card">
      <Link key={_id} href="/comic-book/[id]" as={`/comic-book/${_id}`}>
        <a>
          <div className="content">
            <h3>
              {title} - {issueNo}
            </h3>
          </div>
          <img src={coverImgUrl ?? undefined} alt={title} />
        </a>
      </Link>
      <style jsx>
        {`
          .card {
            position: relative;
            width: 260px;
            height: 380px;
            color: #434343;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: -2px 6px 19px 0px #7f818e;
            transition: transform 0.3s ease;
          }
          .card:hover {
            transform: scale(1.03);
          }
          .card h3 {
            margin: 0;
            font-size: 18px;
          }
          .card img {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
          }
          .card a {
          }
          .content {
            z-index: 1;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 18px 18px 24px;
            background: rgba(255, 255, 255, 0.6);
            min-height: 40%;
            text-align: center;
          }
        `}
      </style>
    </article>
  )
}

const Home = () => {
  const { releases } = useReleases({ redirectTo: '/login' })
  return (
    <div>
      <Head title="Home" />

      <div className="hero">
        <h1 className="title">
          Releases{' '}
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
            new Date(),
          )}
        </h1>
        <div className="row">
          {releases
            ? releases.map((comicBook) => (
                <Card key={comicBook._id} {...comicBook} />
              ))
            : null}
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
      `}</style>
    </div>
  )
}

export default Home
