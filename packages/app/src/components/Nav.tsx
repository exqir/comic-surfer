import React, { useState } from 'react'
import Link from 'next/link'

import { useReleases } from 'hooks/useReleases'
import { token } from 'lib/tokens'

export const Navigation: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const { releases } = useReleases()
  return (
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
      ) : null}
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
