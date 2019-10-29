import { gql } from 'apollo-server-micro'

export default gql`
  type Creator {
    _id: ID!
    firstname: String
    lastname: String!
    series: [ComicSeries]
  }
`
