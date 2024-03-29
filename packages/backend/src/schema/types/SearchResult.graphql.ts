import { gql } from 'apollo-server'

export default gql`
  type SearchResult {
    """
    The title of the ComicSeries.
    """
    title: String!
    """
    The url from which the data for the ComicSeries is retrieved from.
    """
    url: String!
    """
    Indicating if the ComicSeries is on the PullList of the current user.
    Will always be false when there is no current user.
    """
    inPullList: Boolean!
  }
`
