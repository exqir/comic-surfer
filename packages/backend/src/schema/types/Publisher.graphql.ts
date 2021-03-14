import { gql } from 'apollo-server'

export default gql`
  type Publisher @entity {
    """
    ID of the Publisher.
    """
    _id: String! @id
    """
    Name of the Publisher.
    """
    name: String! @column
    """
    URL of the Icon of the Publisher.
    """
    iconUrl: String @column
    """
    URL of the Publisher.
    """
    url: String @column
    """
    URL of the Publisher on Comixology.
    """
    cxUrl: String @column
    """
    List of ComicSeries published by the Publisher.
    """
    comicSeries: [ComicSeries!]! @link
  }
`
