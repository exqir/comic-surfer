import useSWR from 'swr'
import {
  GetComicBookQuery,
  GetComicBookQueryVariables,
} from 'types/graphql-client-schema'

import type { RequestError } from 'lib/request'
import { query, fetcher } from 'data/getComicBook'

export function useComicBook({ comicBookId }: GetComicBookQueryVariables) {
  const { data, error } = useSWR<GetComicBookQuery, RequestError>(
    [query, comicBookId],
    fetcher,
  )
  const comicBook = data?.comicBook

  return {
    comicBook,
    isLoading: !error && !data,
    isError: error,
  }
}
