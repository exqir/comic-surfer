import { gql } from 'graphql-request'
import {
  GetSearchQuery,
  GetSearchQueryVariables,
} from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  query getSearch($searchQuery: String!) {
    search(q: $searchQuery) {
      title
      url
      inPullList
    }
  }
`

export const fetcher = (
  query: string,
  searchQuery: GetSearchQueryVariables['searchQuery'],
) =>
  request<GetSearchQuery, GetSearchQueryVariables>(query, {
    searchQuery,
  })
