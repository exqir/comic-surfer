import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Update the release date of the ComicBook.
    """
    updateComicBookRelease(comicBookId: ID!): ComicBook
  }
`
