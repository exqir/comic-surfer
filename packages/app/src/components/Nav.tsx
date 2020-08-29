import React from 'react'
import Link from 'next/link'

import { useReleases } from 'hooks/useReleases'

export const Navigation: React.FC = () => {
  const { releases } = useReleases()
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {releases ? null : (
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
        )}
      </ul>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }
        nav {
          text-align: center;
        }
        ul {
          display: flex;
        }
        nav > ul {
          padding: 4px 16px;
        }
        li {
          display: flex;
          padding: 6px 8px;
        }
        a {
          color: #067df7;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </nav>
  )
}
