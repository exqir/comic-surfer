import { gql } from 'graphql-request'
import {
  UnsubscribeFromComicSeriesMutation,
  UnsubscribeFromComicSeriesMutationVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  mutation unsubscribeFromComicSeries($comicSeriesId: ID!) {
    unsubscribeComicSeries(comicSeriesId: $comicSeriesId) {
      _id
      owner
      list {
        _id
        url
      }
    }
  }
`

export const fetcher = (
  query: string,
  comicSeriesId: UnsubscribeFromComicSeriesMutationVariables['comicSeriesId'],
) =>
  request<
    UnsubscribeFromComicSeriesMutation,
    UnsubscribeFromComicSeriesMutationVariables
  >(query, {
    comicSeriesId,
  })
