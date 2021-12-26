import React, { Fragment, useState } from 'react'
import Link from 'next/link'
import { mutate } from 'swr'

import { styled } from 'stitches.config'
import { useAuthentication } from 'hooks/useAuthentication'
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
      <Container>
        <MenuTrigger
          onClick={() => {
            setOpen((open) => !open)
          }}
        >
          Menu
        </MenuTrigger>
        {isOpen ? (
          <Fragment>
            <Search />
            <Nav>
              <Stack as="ul">
                <li>
                  <Link href="/releases" passHref>
                    <MenuItemLink onClick={onNavigation}>Releases</MenuItemLink>
                  </Link>
                </li>
                <li>
                  <Link href="/pull-list" passHref>
                    <MenuItemLink onClick={onNavigation}>PullList</MenuItemLink>
                  </Link>
                </li>
                <li>
                  <Link href="/login" passHref>
                    <MenuItemLink
                      onClick={async () => {
                        if (isAuthenticated) await logoutUser()
                        onNavigation()
                      }}
                    >
                      {isAuthenticated ? 'Logout' : 'Login'}
                    </MenuItemLink>
                  </Link>
                </li>
              </Stack>
            </Nav>
          </Fragment>
        ) : null}
      </Container>
      {isOpen ? <Backdrop onClick={onNavigation} /> : null}
    </div>
  )
}

const Container = styled('div', {
  zIndex: 10000,
  position: 'fixed',
  bottom: '$l',
  right: '$l',
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'flex-end',
})

const Backdrop = styled('div', {
  zIndex: 9000,
  position: 'fixed',
  inset: 0,
  top: 0,
  background: 'rgba(0, 0, 0, 0.3)',
})

const MenuTrigger = styled('button', {
  cursor: 'pointer',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: '$background',
  border: 'none',
  boxShadow: '$s',
})

const Nav = styled('nav', {
  background: '$background',
  borderRadius: '$m',
  boxShadow: '$s',
  marginBottom: '$l',
})

const MenuItemLink = styled('a', {
  padding: '$l $xl',
  display: 'block',
  textTlign: 'right',
  color: '#067df7',
  textDecoration: 'none',
  fontSize: '13px',
})
