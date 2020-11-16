import { gql } from 'graphql-request'
import {
  GetComicBookQuery,
  GetComicBookQueryVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  query getComicBook($comicBookId: ID!) {
    comicBook(id: $comicBookId) {
      _id
      title
      issueNo
      coverImgUrl
      releaseDate
      description
      url
      comicSeries {
        _id
        singleIssues {
          _id
          title
          issueNo
          coverImgUrl
          releaseDate
        }
      }
    }
  }
`

export const fetcher = (
  query: string,
  comicBookId: GetComicBookQueryVariables['comicBookId'],
) =>
  request<GetComicBookQuery, GetComicBookQueryVariables>(query, {
    comicBookId,
  })
