import React from 'react'
import Link from 'next/link'

import Head from '../components/head'
import Nav from '../components/nav'
import { useReleases } from '../hooks/useReleases'

const Home = () => {
  const releases = useReleases({ redirectTo: '/login' })
  return (
    <div>
      <Head title="Home" />
      <Nav />

      <div className="hero">
        <h1 className="title">Welcome to Next!</h1>
        <p className="description">
          To get started, edit the <code>pages/index.js</code> or{' '}
          <code>pages/api/date.js</code> files, then save to reload.
        </p>

        <div className="row">
          {releases
            ? releases.map(({ _id, title, issueNo, coverImageUrl, url }) => (
                <a className="card" href={url} key={_id}>
                  <h3>
                    {title} - {issueNo}
                  </h3>
                  <img src={coverImageUrl} alt={title} />
                </a>
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

export default Home
