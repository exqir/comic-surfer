import { ApolloServer } from 'apollo-server'
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
} from './datasources'
import { GraphQLContext } from 'types/app'
import { comixology } from 'services/ComixologyScaper'
import { none, some } from 'fp-ts/lib/Option'
import { createLogger } from 'services/LogService'

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
  }),
  context: async (): Promise<Omit<GraphQLContext, 'dataSources'>> => ({
    db,
    dataLayer: mongad,
    services: {
      scrape: comixology(scrapeIt, logger, baseUrl),
      logger,
    },
    // TODO: Use issuer from https://docs.magic.link/admin-sdk/node-js/sdk/users-module/getmetadatabytoken
    // Example with Next: https://github.com/vercel/next.js/tree/canary/examples/with-magic
    user: 'some-user-id',
  }),
})

apolloServer
  .listen(5000)
  .then(({ url }) => console.log(`GraphQL Server started at: ${url}`))
