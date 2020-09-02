import type { AppProps } from 'next/app'
import type { GraphQLError } from 'graphql-request/dist/types'
import { AuthenticationError } from 'apollo-server'
import { SWRConfig, ConfigInterface, mutate } from 'swr'

import { printVars } from 'lib/tokens'
import { Navigation } from 'components/Nav'

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
        `}
      </style>
      <Navigation />
      <Component {...pageProps} />
    </SWRConfig>
  )
}
