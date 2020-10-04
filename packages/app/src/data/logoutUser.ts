import { gql } from 'graphql-request'
import { LoginUserMutation } from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  mutation logoutUser {
    logout
  }
`

export const fetcher = (query: string) => request<LoginUserMutation>(query)
