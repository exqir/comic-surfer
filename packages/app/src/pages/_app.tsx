import type { AppProps } from 'next/app'
import type { GraphQLError } from 'graphql-request/dist/types'
import { AuthenticationError } from 'apollo-server'
import { SWRConfig, ConfigInterface, mutate } from 'swr'
import Router from 'next/router'

import { globalCss } from 'stitches.config'
import { Navigation } from 'components/Nav'
import { Container } from 'components/Container'
import { Waves } from 'components/Waves'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

const swrConfig: ConfigInterface<
  any,
  (GraphQLError | AuthenticationError | Error)[] | undefined,
  (...args: any) => any
> = {
  // Reset data on Authentication Error without revalidation.
  // This allows the data to be refeteched once the component
  // containing the hook is rerendered again. Otherwise the error
  // and the data, if it was fetched before, are still in the cache.
  onError(errors, key) {
    if (
      Array.isArray(errors) &&
      errors.some(
        (error) =>
          'extensions' in error && error.extensions.code === 'UNAUTHENTICATED',
      )
    ) {
      mutate(key, null, false)
      document.cookie = 'authenticated=;Max-Age=-1'
      // When not on the login page, redirect to it while
      // preserving the page coming from to redirect back
      // to it once the user is authenticated again.
      if (Router.pathname === '/login') return
      const search = Object.entries(Router.query).reduce(
        (s, [key, value], i) =>
          value === undefined
            ? s + `${i > 0 ? '&' : ''}${key}`
            : s +
              `${i > 0 ? '&' : ''}${key}=${
                Array.isArray(value) ? value.join(',') : value
              }`,
        '',
      )
      Router.push({
        pathname: '/login',
        query: { from: Router.pathname + search ? '?' + search : '' },
      })
    }
  },
}

const globalStyles = globalCss({
  body: {
    margin: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Helvetica, sans-serif',
    position: 'relative',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
})

export default function App({ Component, pageProps }: AppProps) {
  globalStyles()

  return (
    <SWRConfig value={swrConfig}>
      <Container>
        <Navigation />
        <Component {...pageProps} />
      </Container>
      <Waves />
    </SWRConfig>
  )
}
