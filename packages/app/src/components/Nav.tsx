import React, { Fragment, useState } from 'react'
import Link from 'next/link'
import { mutate } from 'swr'

import { useAuthentication } from 'hooks/useAuthentication'
import { token } from 'lib/tokens'
import { Stack } from 'components/Stack'
import { Search } from 'components/Search'
import { query, fetcher } from 'data/logoutUser'
import { query as loginQuery } from 'data/loginUser'

const logoutUser = async () => {
  await fetcher(query)
  await mutate(loginQuery, null, false)
  document.cookie = 'authenticated=;Max-Age=-1'
}

export const Navigation: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const isAuthenticated = useAuthentication()
  const onNavigation = () => {
    setOpen(false)
  }
  return (
    <div>
      <div className="container">
        <button
          className="menu"
          onClick={() => {
            setOpen((open) => !open)
          }}
        >
          Menu
        </button>
        {isOpen ? (
          <Fragment>
            <Search />
            <nav>
              <Stack component="ul">
                <Link href="/releases">
                  <a onClick={onNavigation}>Releases</a>
                </Link>
                <Link href="/pull-list">
                  <a onClick={onNavigation}>PullList</a>
                </Link>
                <Link href="/login">
                  <a
                    onClick={async () => {
                      if (isAuthenticated) await logoutUser()
                      onNavigation()
                    }}
                  >
                    {isAuthenticated ? 'Logout' : 'Login'}
                  </a>
                </Link>
              </Stack>
            </nav>
          </Fragment>
        ) : null}
      </div>
      {isOpen ? <div className="backdrop" onClick={onNavigation} /> : null}
      <style jsx>{`
        .container {
          z-index: 10000;
          position: fixed;
          bottom: ${token('spaceL')};
          right: ${token('spaceL')};
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
        }
        .backdrop {
          z-index: 9000;
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.3);
        }
        .menu {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: ${token('background')};
          border: none;
          box-shadow: ${token('shadowSmall')};
        }
        nav {
          background: ${token('background')};
          border-radius: ${token('borderRadius')};
          box-shadow: ${token('shadowSmall')};
          margin-bottom: ${token('spaceL')};
        }
        a {
          padding: ${token('spaceL')} ${token('spaceXL')};
          display: block;
          text-align: right;
          color: #067df7;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}
