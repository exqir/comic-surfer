import { gql } from 'apollo-server-micro'

export default gql`
  extend type Query {
    getSearch(q: String!): [Search]
    getSearchByPublishers(q: String!, publishers: [String!]!): [Search]
  }

  type Search {
    title: String!
    url: String!
    publisher: Publisher!
  }
`
