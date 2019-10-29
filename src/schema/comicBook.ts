import { gql } from 'apollo-server-micro'

export default gql`
  extend type Query {
    getComicBook(id: ID!): ComicBook
  }

  type ComicBook {
    _id: ID!
    title: String!
    issue: String
    releaseDate: String
    creators: [Creator]
    series: ComicSeries
    publisher: Publisher
    coverUrl: String
    url: String!
  }
`
