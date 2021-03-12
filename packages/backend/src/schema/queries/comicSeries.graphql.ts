import { gql } from 'apollo-server'

export default gql`
  type Query {
    """
    Get the ComicSeries matching the provided ID.
    """
    comicSeries(id: ID!): ComicSeries
  }
`
