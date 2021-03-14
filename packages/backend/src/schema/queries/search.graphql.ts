import { gql } from 'apollo-server'

export default gql`
  type Query {
    """
    Searchs for ComicSeries containing the given query.
    """
    search(query: String!): [SearchResult!]
  }
`
