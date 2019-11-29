import { ApolloServer, gql } from 'apollo-server-micro'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';

const typeDefs = gql`
  type Query {
    users: [User!]!
  }
  type User {
    name: String
  }
`

const resolvers = {
  Query: {
    users(parent, args, context) {
      return [{ name: 'Nextjs' }]
    }
  }
}

const apolloServer = new ApolloServer({ typeDefs: [DIRECTIVES, typeDefs], resolvers })

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })