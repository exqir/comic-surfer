import { gql } from 'apollo-server'

export default gql`
  type ComicSeries @entity {
    """
    ID of the ComicSeries.
    """
    _id: ID! @id
    """
    The title of the ComicSeries.
    """
    title: String! @column
    """
    The url from which the data for the ComicSeries is retrieved from.
    """
    url: String! @column
    """
    The url from which the collections for the ComicSeries are retrieved from.
    """
    collectionsUrl: String @column
    """
    The url from which the single issues for the ComicSeries are retrieved from.
    """
    singleIssuesUrl: String @column
    """
    The Publisher of the ComicSeries.
    """
    publisher: Publisher @link
    """
    The list of collection ComicBooks belonging to the ComicSeries.
    """
    collections: [ComicBook!]! @link
    """
    The list of single issue ComicBooks belonging to the ComicSeries.
    """
    singleIssues: [ComicBook!]! @link
    """
    The last time the ComicSeries was modified.
    """
    lastModified: Date! @column
    """
    The url for the cover of the latest single issue or collection of the ComicSeries.
    """
    coverImgUrl: String
    """
    The number of single issues belonging to the ComicSeries.
    """
    singleIssuesNumber: Int!
    """
    The number of collections belonging to the ComicSeries.
    """
    collectionsNumber: Int!
  }
`
