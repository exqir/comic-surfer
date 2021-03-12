import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Logout the current user.
    """
    logout: Boolean!
  }
`
