import type { AppProps } from 'next/app'
import type { GraphQLError } from 'graphql-request/dist/types'
import { AuthenticationError } from 'apollo-server'
import { SWRConfig, ConfigInterface, mutate } from 'swr'
import Router from 'next/router'

import { printVars } from 'lib/tokens'
import { Navigation } from 'components/Nav'
import { Container } from 'components/Container'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

const swrConfig: ConfigInterface<
  any,
  (GraphQLError | AuthenticationError | Error)[] | undefined
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
      // document.cookie = 'authenticated=;Max-Age=-1'
      // Router.push('/')
    }
  },
}

const cssVars = printVars()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={swrConfig}>
      <style jsx global>
        {`
          :root {
            ${cssVars}
          }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
              Helvetica, sans-serif;
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        `}
      </style>
      <Navigation />
      <Container>
        <Component {...pageProps} />
      </Container>
    </SWRConfig>
  )
}
