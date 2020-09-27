import { gql } from 'graphql-request'
import {
  SubscribeToComicSeriesMutation,
  SubscribeToComicSeriesMutationVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  mutation subscribeToComicSeries($comicSeriesUrl: String!) {
    subscribeComicSeries(comicSeriesUrl: $comicSeriesUrl) {
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
  comicSeriesUrl: SubscribeToComicSeriesMutationVariables['comicSeriesUrl'],
) =>
  request<
    SubscribeToComicSeriesMutation,
    SubscribeToComicSeriesMutationVariables
  >(query, {
    comicSeriesUrl,
  })
