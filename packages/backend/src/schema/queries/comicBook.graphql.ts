import { gql } from 'apollo-server'

export default gql`
  type Query {
    """
    Get the ComicBook matching the provided ID.
    """
    comicBook(id: ID!): ComicBook
  }
`
