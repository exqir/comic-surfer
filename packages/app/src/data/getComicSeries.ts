import { gql } from 'graphql-request'
import {
  GetComicSeriesQuery,
  GetComicSeriesQueryVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  query getComicSeries($comicSeriesId: ID!) {
    comicSeries(id: $comicSeriesId) {
      _id
      title
      singleIssues {
        _id
        title
        issueNo
        coverImgUrl
      }
      collections {
        _id
        title
        issueNo
        coverImgUrl
      }
      publisher {
        _id
        name
      }
    }
  }
`

export const fetcher = (
  query: string,
  comicSeriesId: GetComicSeriesQueryVariables['comicSeriesId'],
) =>
  request<GetComicSeriesQuery, GetComicSeriesQueryVariables>(query, {
    comicSeriesId,
  })
