import type { AppProps } from 'next/app'
import type { GraphQLError } from 'graphql-request/dist/types'
import type { AuthenticationError } from 'apollo-server'
import { SWRConfig, ConfigInterface, mutate } from 'swr'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

const swrConfig: ConfigInterface<
  any,
  (GraphQLError | AuthenticationError)[]
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={swrConfig}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}
