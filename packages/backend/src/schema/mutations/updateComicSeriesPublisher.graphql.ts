import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Set the Publisher of a ComicSeries.
    """
    updateComicSeriesPublisher(comicSeriesId: ID!): ComicSeries
  }
`
