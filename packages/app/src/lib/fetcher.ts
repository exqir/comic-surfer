import { GraphQLClient, ClientError } from 'graphql-request'

type Variables = {
  [key: string]: any
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || ''

const options = {
  credentials: 'include',
  mode: 'cors',
} as const

const client = new GraphQLClient(API_ENDPOINT, options)

export const fetcher = <Result, Vars = Variables>(
  query: string,
  variables?: Vars,
) =>
  client.request<Result>(query, variables).catch((error: ClientError) => {
    throw error.response.errors
  })

export const fetcherWithToken = <Result>(
  query: string,
  token: string,
  variables?: Variables,
) => {
  const _client = new GraphQLClient(API_ENDPOINT, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return _client.request<Result>(query, variables)
}

export const _fetcher = (
  query: string,
  operationName: string,
  variables?: Variables,
) => {
  const body = JSON.stringify({
    query,
    operationName,
    variables: variables ? variables : undefined,
  })
  return fetch(API_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).then((r) => r.json)
}
