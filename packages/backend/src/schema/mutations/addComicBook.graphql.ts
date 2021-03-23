import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Add a new ComicBook.
    """
    addComicBook(
      comicBookUrl: String!
      comicSeriesId: ID!
      comicBookType: ComicBookType!
    ): ComicBook
  }
`
