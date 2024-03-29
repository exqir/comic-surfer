import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Login a user based on the token given in the Authorization header.
    If the user does not exist yet, a new one will be created.
    """
    login: PullList!
  }
`
