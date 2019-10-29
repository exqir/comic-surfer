import { gql } from 'apollo-server-micro'

export default gql`
  extend type Query {
    getComicSeries(id: ID!): ComicSeries
  }

  type ComicSeries {
    _id: ID!
    title: String!
    url: String!
    collectionsUrl: String
    issuesUrl: String
    publisher: Publisher
    collections: [ComicBook]
    issues: [ComicBook]
  }
`
