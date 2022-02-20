import type { FunctionComponent } from 'react'
import React from 'react'
import Router, { useRouter } from 'next/router'
import NextLink, { LinkProps } from 'next/link'
import { mutate } from 'swr'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

import { styled } from 'stitches.config'
import { query, fetcher } from 'data/logoutUser'
import { query as loginQuery } from 'data/loginUser'
import { Card } from 'components'

const logoutUser = async () => {
  await fetcher(query)
  await mutate(loginQuery, null, false)
  Router.push('/login')
}

export const Navigation: FunctionComponent = () => {
  return (
    <BottomNavigation>
      <NavigationItemList as="ul">
        <li>
          <NavLink href="/releases">Releases</NavLink>
        </li>
        <li>
          <NavLink href="/pull-list">PullList</NavLink>
        </li>
        <li>
          <DropdownMenu.Root>
            <HamburgerMenuTrigger>
              <HamburgerMenuIcon />
            </HamburgerMenuTrigger>
            <HamburgerMenuContent
              side="top"
              sideOffset={8}
              align="end"
              alignOffset={-8}
            >
              <DropdownMenu.Item onSelect={logoutUser}>
                Logout
              </DropdownMenu.Item>
            </HamburgerMenuContent>
          </DropdownMenu.Root>
        </li>
      </NavigationItemList>
    </BottomNavigation>
  )
}

const NavLink: FunctionComponent<Omit<LinkProps, 'passHref'>> = (props) => {
  const router = useRouter()
  const isActive = router.asPath === props.href

  return (
    <NextLink passHref {...props}>
      <Link isActive={isActive} {...(isActive && { 'aria-current': 'page' })}>
        {props.children}
      </Link>
    </NextLink>
  )
}

const BottomNavigation = styled('nav', {
  position: 'fixed',
  zIndex: '$max',
  bottom: '$l',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: '$m',
  paddingRight: '$m',
})

const NavigationItemList = styled(Card, {
  // Reset list styled
  listStyle: 'none',
  margin: '0 auto',
  padding: '$m',

  display: 'flex',
  alignItems: 'center',
  gap: '$m',
})

const Link = styled('a', {
  padding: '$m $xl',
  display: 'block',
  textTlign: 'right',
  color: '$text',
  textDecoration: 'none',
  fontSize: '13px',
  borderRadius: '$m',

  variants: {
    isActive: {
      true: {
        color: '#fff',
        background: '$primary',
      },
    },
  },
})

const HamburgerMenuTrigger = styled(DropdownMenu.Trigger, {
  appearance: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '$m',
})

const HamburgerMenuContent = styled(DropdownMenu.Content, Card, {
  padding: '$m',
})
