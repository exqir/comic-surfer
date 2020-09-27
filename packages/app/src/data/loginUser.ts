import { gql } from 'graphql-request'
import { LoginUserMutation } from 'types/graphql-client-schema'

import { requestWithToken } from 'lib/request'

export const query = gql`
  mutation loginUser {
    login {
      _id
      owner
      list {
        _id
        url
      }
    }
  }
`

export const fetcher = (token: string, query: string) =>
  requestWithToken<LoginUserMutation>(query, token)
