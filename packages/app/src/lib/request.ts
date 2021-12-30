import { GraphQLClient, ClientError } from 'graphql-request'

type Variables = {
  [key: string]: any
}

export type RequestError =
  | ClientError['response']['errors']
  | Error[]
  | undefined

// Use an absolute URL for server side requests
const API_ENDPOINT = `${
  typeof window === 'undefined' ? process.env.API_HOST : ''
}/graphql`

const options = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    'apollographql-client-name': 'nextjs',
    'apollographql-client-version':
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'develop',
  },
} as const

const client = new GraphQLClient(API_ENDPOINT, options)

const handleError = (error: Error | ClientError) => {
  if ('response' in error) {
    throw error.response.errors
  }
  throw [error]
}

export const request = <Result, Vars = Variables>(
  query: string,
  variables?: Vars,
) => client.request<Result>(query, variables).catch(handleError)

export const requestWithToken = <Result>(
  query: string,
  token: string,
  variables?: Variables,
) => {
  const _client = new GraphQLClient(API_ENDPOINT, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
  return _client.request<Result>(query, variables).catch(handleError)
}
