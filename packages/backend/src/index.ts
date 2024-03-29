import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginUsageReporting } from 'apollo-server-core'
import * as mongad from 'mongad'
import scrapeIt from 'scrape-it'

import { schema } from 'schema'
import { resolvers } from 'resolvers'
import { dataSources } from 'datasources'
import { GraphQLContext } from 'types/app'
import { comixology } from 'services/Scraper/ComixologyScaper'
import { createLogger } from 'services/LogService'
import { Authentication } from 'services/Authentication'
import { EnvironmentService } from 'services/Environment/Environment.service'
import { createConnectToDb } from 'lib/connectToDb'

const logger = createLogger('Comic-Surfer', 'de-DE')

const connectToDb = createConnectToDb(logger)

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources: dataSources({ dataLayer: mongad, logger }),
  context: async ({
    req,
    res,
  }): Promise<Omit<GraphQLContext, 'dataSources'>> => ({
    req,
    res,
    db: await connectToDb(),
    dataLayer: mongad,
    services: {
      scrape: comixology({
        scraper: scrapeIt,
        logger,
        env: EnvironmentService,
      }),
      logger,
      authentication: Authentication,
    },
    user: await Authentication.getUserFromSession(req)(),
  }),
  cors: {
    credentials: true,
    origin: [
      process.env.NODE_ENV !== 'production' && 'http://localhost:3000',
      'https://comic-surfer.vercel.app',
      'https://comic-surfer-exqir.vercel.app',
      /^https:\/\/comic-surfer-[a-z0-9]+-exqir.vercel.app$/,
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
  introspection: true,
  playground: true,
})

apolloServer
  .listen(process.env.PORT ?? 5000, '0.0.0.0')
  .then(({ url }) => logger.log(`GraphQL Server started at: ${url}`)())
