import { gql } from 'graphql-request'
import {
  AddToPullListMutation,
  AddToPullListMutationVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  mutation addToPullList($comicSeriesUrl: String!) {
    addToPullList(comicSeriesUrl: $comicSeriesUrl) {
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
  comicSeriesUrl: AddToPullListMutationVariables['comicSeriesUrl'],
) =>
  request<AddToPullListMutation, AddToPullListMutationVariables>(query, {
    comicSeriesUrl,
  })
