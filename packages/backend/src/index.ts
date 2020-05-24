import { ApolloServer } from 'apollo-server'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { Db } from 'mongodb'
import * as mongad from 'mongad'
import scrapeIt from 'scrape-it'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, mapLeft, fold } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'
import { of } from 'fp-ts/lib/Task'
import typeDefs, { resolvers } from './schema'
import {
  ComicBookAPI,
  ComicSeriesAPI,
  CreatorAPI,
  PublisherAPI,
  PullListAPI,
} from './datasources'
import { GraphQLContext } from 'types/app'
import { ScrapeService } from 'services/ScrapeService'
import { none, some } from 'fp-ts/lib/Option'
import { createLogger } from 'services/LogService'

const dbConnectionString = process.env.MONGO_URL || 'mongodb://mongo:27017'
const dbName = process.env.DB_NAME || 'riddler'
const baseUrl = process.env.SCRAP_BASE_URL || 'https://m.comixology.eu'
const searchPath = process.env.SCRAP_SEARCH_PATH || '/search/series?search='

let db: Option<Db>

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
    creator: new CreatorAPI(),
    publisher: new PublisherAPI(),
    pullList: new PullListAPI(),
  }),
  context: async (): Promise<Omit<GraphQLContext, 'dataSources'>> => ({
    db,
    dataLayer: mongad,
    services: {
      scrape: new ScrapeService({
        scraper: scrapeIt,
        baseUrl,
        searchPath,
      }),
      logger: createLogger('Comic-Surfer', 'de-DE'),
    },
  }),
})

apolloServer
  .listen(5000)
  .then(({ url }) => console.log(`GraphQL Server started at: ${url}`))
