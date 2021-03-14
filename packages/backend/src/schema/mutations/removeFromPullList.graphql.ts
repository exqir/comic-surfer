import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Remove a ComicSeries from the users PullList based on its id.
    """
    removeFromPullList(comicSeriesId: ID!): PullList
  }
`
