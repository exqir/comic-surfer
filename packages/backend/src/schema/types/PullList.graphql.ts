import { gql } from 'apollo-server'

export default gql`
  type PullList @entity {
    """
    ID of the PullList.
    """
    _id: ID! @id
    """
    The user the PullList belongs to.
    """
    owner: String! @column
    """
    The list of ComicSeries on the PullList.
    """
    list: [ComicSeries!]! @link
  }
`
