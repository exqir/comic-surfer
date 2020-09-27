import useSWR from 'swr'
import {
  GetSearchQuery,
  GetSearchQueryVariables,
} from 'types/graphql-client-schema'

import type { RequestError } from 'lib/request'
import { query, fetcher } from 'data/getSearch'

export function useSearch({ searchQuery }: GetSearchQueryVariables) {
  const { data, error } = useSWR<GetSearchQuery, RequestError>(
    Boolean(searchQuery) ? [query, searchQuery] : null,
    fetcher,
  )

  const search = data?.search

  return {
    search,
    isLoading: Boolean(searchQuery) && !error && !data,
    isError: error,
  }
}
