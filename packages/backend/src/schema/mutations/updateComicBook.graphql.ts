import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Update ComicBook data.
    """
    updateComicBook(comicBookId: ID!): ComicBook
  }
`
