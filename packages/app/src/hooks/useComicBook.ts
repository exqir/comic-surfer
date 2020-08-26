import useSWR from 'swr'
import { gql, ClientError } from 'graphql-request'
import {
  GetComicBookQuery,
  GetComicBookQueryVariables,
} from 'types/graphql-client-schema'

import { fetcher as _fetcher } from '../lib/fetcher'

export const query = gql`
  query getComicBook($comicBookId: ID!) {
    comicBook(id: $comicBookId) {
      _id
      title
      issueNo
      coverImgUrl
      releaseDate
      url
    }
  }
`

export const fetcher = (query: string, comicBookId: string) =>
  _fetcher<GetComicBookQuery, GetComicBookQueryVariables>(query, {
    comicBookId,
  })

export function useComicBook({ comicBookId }: GetComicBookQueryVariables) {
  const { data, error } = useSWR<
    GetComicBookQuery,
    ClientError['response']['errors']
  >([query, comicBookId], fetcher)
  const comicBook = data?.comicBook

  return error ? null : comicBook
}
