import React, { Fragment, useState } from 'react'
import Link from 'next/link'

import { useReleases } from 'hooks/useReleases'
import { token } from 'lib/tokens'
import { Search } from 'components/Search'

export const Navigation: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const { releases } = useReleases()
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
            </nav>
          </Fragment>
        ) : null}
      </div>
      {isOpen ? <div className="backdrop" /> : null}
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
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
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
