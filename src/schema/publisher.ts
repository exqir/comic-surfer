import { gql } from 'apollo-server-micro'

// @TODO: check which of the four paths are really needed
export default gql`
  extend type Query {
    getPublishers(names: [String!]!): [Publisher!]
    getPublisher(name: String!): Publisher
  }

  type Publisher {
    _id: String!
    name: String!
    iconUrl: String
    url: String
    basePath: String
    seriesPath: String
    searchPath: String
    searchPathSeries: String
    series: [ComicSeries]
  }
`
