import { gql } from 'apollo-server'

export default gql`
  type Query {
    """
    The PullList of the currently loggedin user.
    """
    pullList: PullList!
  }
`
