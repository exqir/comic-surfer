import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginUsageReporting } from 'apollo-server-core'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { Db } from 'mongodb'
import * as mongad from 'mongad'
import scrapeIt from 'scrape-it'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, fold } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'
import { of } from 'fp-ts/lib/Task'
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
import { none, some } from 'fp-ts/lib/Option'
import { createLogger } from 'services/LogService'
import { Authentication } from 'services/Authentication'

const dbConnectionString = process.env.MONGO_URL || 'mongodb://mongo:27017'
const dbName = process.env.DB_NAME || 'riddler'
const baseUrl = process.env.COMIXOLOGY_BASE_URL || 'https://m.comixology.eu'

let db: Option<Db>
const logger = createLogger('Comic-Surfer', 'de-DE')

const connectToDb = pipe(
  mongad.connect(dbConnectionString, { useUnifiedTopology: true }),
  map(mongad.getDb(dbName)),
  fold(
    (_) => of(none),
    (db) => of(some(db)),
  ),
)

const setDb = async () => {
  db = await connectToDb()
}

setDb()

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
    db,
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
  plugins: [
    ApolloServerPluginUsageReporting({
      sendHeaders: { exceptNames: ['Authorization'] },
    }),
  ],
})

apolloServer
  .listen(5000)
  .then(({ url }) => console.log(`GraphQL Server started at: ${url}`))
