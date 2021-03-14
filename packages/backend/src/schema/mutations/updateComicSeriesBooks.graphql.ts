import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Update List of ComicBooks belonging to the ComicSeres.
    """
    updateComicSeriesBooks(
      comicSeriesId: ID!
      comicBookType: ComicBookType!
      comicBookListPath: String
    ): [ComicBook!]
  }
`
