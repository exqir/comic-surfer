import { ApolloServer } from 'apollo-server'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import typeDefs, { resolvers } from './schema'
import {
  ComicBookAPI,
  ComicSeriesAPI,
  CreatorAPI,
  PublisherAPI,
  PullListAPI,
} from './datasources'

const apolloServer = new ApolloServer({
  typeDefs: [DIRECTIVES, ...typeDefs],
  resolvers,
  dataSources: () => ({
    comicBook: new ComicBookAPI(),
    comicSeries: new ComicSeriesAPI(),
    creator: new CreatorAPI(),
    publisher: new PublisherAPI(),
    pullList: new PullListAPI(),
  }),
  context: () => ({}),
})

apolloServer.listen(5000, 'localhost')
