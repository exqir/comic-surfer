import { gql } from 'apollo-server'

export default gql`
  enum ComicBookType {
    SINGLEISSUE
    COLLECTION
  }

  type ComicBook @entity {
    """
    ID of the ComicBook.
    """
    _id: ID! @id
    """
    Title of the ComicBook.
    """
    title: String! @column
    """
    Issue Number of the ComicBook.
    """
    issueNo: String @column
    """
    Release Date of the ComicBook.
    """
    releaseDate: Date @column
    """
    List of Creators of the ComicBook.
    """
    creators: [Creator!]! @embedded
    """
    ComicSeries the ComicBook belongs to.
    """
    comicSeries: ComicSeries @link
    """
    Publisher of the ComicBook.
    """
    publisher: Publisher @link
    """
    URL of the Cover Image of the ComicBook.
    """
    coverImgUrl: String @column
    """
    URL of the ComicBook on Comixology.
    """
    url: String! @column
    """
    Description for the ComicBook. HTML containing Tags for basic text styling.
    """
    description: String @column
    """
    Type of ComicBook
    """
    type: ComicBookType! @column
    """
    Date the ComicBook was last modified.
    """
    lastModified: Date! @column
  }

  type Creator @entity(embedded: true) {
    """
    Name of the Creator.
    """
    name: String! @column
  }
`
