import { gql } from 'graphql-request'
import {
  RemoveFromPullListMutation,
  RemoveFromPullListMutationVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  mutation removeFromPullList($comicSeriesId: ID!) {
    removeFromPullList(comicSeriesId: $comicSeriesId) {
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
  comicSeriesId: RemoveFromPullListMutationVariables['comicSeriesId'],
) =>
  request<RemoveFromPullListMutation, RemoveFromPullListMutationVariables>(
    query,
    {
      comicSeriesId,
    },
  )
