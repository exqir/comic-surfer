import { gql } from 'graphql-request'
import { GetPullListQuery } from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  query getPullList {
    pullList {
      _id
      owner
      list {
        _id
        url
      }
    }
  }
`

export const fetcher = (query: string) => request<GetPullListQuery>(query)
