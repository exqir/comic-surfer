import { gql } from 'apollo-server'

export default gql`
  extend type Mutation {
    """
    Add a ComicSeries to the users PullList based on its url.
    """
    addToPullList(comicSeriesUrl: String!): PullList
  }
`
