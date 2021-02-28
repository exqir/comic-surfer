import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginUsageReporting } from 'apollo-server-core'
import * as mongad from 'mongad'
import scrapeIt from 'scrape-it'
import { schema } from 'schema'
import { resolvers } from 'resolvers'
import {
  ComicBookRepository,
  ComicSeriesRepository,
  PublisherRepository,
  PullListRepository,
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
  typeDefs: schema,
  resolvers,
  dataSources: () => ({
    comicBook: new ComicBookRepository({ dataLayer: mongad, logger }),
    comicSeries: new ComicSeriesRepository({ dataLayer: mongad, logger }),
    publisher: new PublisherRepository({ dataLayer: mongad, logger }),
    pullList: new PullListRepository({ dataLayer: mongad, logger }),
    queue: new QueueRepository({ dataLayer: mongad, logger }),
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
      authentication: Authentication,
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
