import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginUsageReporting } from 'apollo-server-core'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import * as mongad from 'mongad'
import scrapeIt from 'scrape-it'
import typeDefs, { resolvers } from './schema'
import {
  ComicBookAPI,
  ComicSeriesAPI,
  PublisherAPI,
  PullListAPI,
  QueueRepository,
} from './datasources'
import { GraphQLContext, DataSources } from 'types/app'
import { comixology } from 'services/ComixologyScaper'
import { createLogger } from 'services/LogService'
import { Authentication } from 'services/Authentication'
import { createConnectToDb } from 'lib/connectToDb'

const baseUrl = process.env.COMIXOLOGY_BASE_URL || 'https://m.comixology.eu'

const logger = createLogger('Comic-Surfer', 'de-DE')

const connectToDb = createConnectToDb(logger)

const apolloServer = new ApolloServer({
  typeDefs: [DIRECTIVES, ...typeDefs],
  resolvers,
  dataSources: () => ({
    comicBook: new ComicBookAPI(),
    comicSeries: new ComicSeriesAPI(),
    publisher: new PublisherAPI(),
    pullList: new PullListAPI(),
    queue: new QueueRepository(),
  }),
  context: async ({
    req,
    res,
  }): Promise<Omit<GraphQLContext, 'dataSources'>> => ({
    req,
    res,
    db: await connectToDb(),
    dataLayer: mongad,
    services: {
      scrape: comixology(scrapeIt, logger, baseUrl),
      logger,
    },
    user: await Authentication.getUserFromSession(req)(),
  }),
  cors: {
    credentials: true,
    origin: [
      process.env.NODE_ENV !== 'production' && 'http://localhost:3000',
      /comic-surfer.now.sh/,
      /exqir.now.sh/,
      /exqir.vercel.app/,
    ].filter((val): val is string | RegExp => Boolean(val)),
  },
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          ApolloServerPluginUsageReporting({
            sendHeaders: { exceptNames: ['Authorization'] },
          }),
        ]
      : undefined,
})

apolloServer
  .listen(5000)
  .then(({ url }) => logger.log(`GraphQL Server started at: ${url}`))
