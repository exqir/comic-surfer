import useSWR from 'swr'
import { GetPullListQuery } from 'types/graphql-client-schema'

import type { RequestError } from 'lib/request'
import { query, fetcher } from 'data/getPullList'

export function usePullList() {
  const { data, error, mutate } = useSWR<GetPullListQuery, RequestError>(
    query,
    fetcher,
  )
  const pullList = data?.pullList

  return {
    pullList,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
