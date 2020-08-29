import { gql } from 'graphql-request'
import { LoginUserMutation } from 'types/graphql-client-schema'

import { requestWithToken, request } from '../lib/request'

export const query = gql`
  mutation loginUser {
    login {
      _id
      owner
    }
  }
`

export const fetcher = (token: string, query: string) =>
  requestWithToken<LoginUserMutation>(query, token)
