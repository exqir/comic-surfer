import { Db } from 'mongodb'
import { Response, Request } from 'express'
import { some } from 'fp-ts/lib/Option'
import { KeyValueCache } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server'
import { Services } from 'types/app'
import { schema } from 'schema'
import { resolvers } from 'resolvers'
import { dataSources } from 'datasources'
import { IScraperService } from 'services/Scraper/Scraper.interface'
import { logger, dataLayer } from '__tests__/_mock'

const mockScraper: IScraperService = {
  getComicSeries: jest.fn(),
  getComicBookList: jest.fn(),
  getComicBook: jest.fn(),
  getComicSeriesSearch: jest.fn(),
}

/**
 * Creates a mock GraphQL config object.
 */
export const createMockConfig = () => ({
  context: {
    req: {} as Request,
    res: {} as Response,
    dataLayer: dataLayer,
    services: {
      scrape: mockScraper,
      logger: logger,
    } as Services,
    db: some({} as Db),
    user: some('some-user-id'),
  },
  cache: {} as KeyValueCache,
})

/**
 * Creates an `ApolloServer` for integration tests.
 * From: https://github.com/apollographql/fullstack-tutorial/blob/master/final/server/src/__tests__/__utils.js
 * @param context Context object to be merged with default mock config.
 * @returns { server: ApolloServer, comicBook: ComicBookAPI, comicSeries: ComicSeriesAPI, publisher: PublisherAPI, pullList: PullListAPI }
 */
export const constructTestServer = (context: {} = {}) => {
  const defaultContext = createMockConfig().context
  const sources = dataSources({
    logger: defaultContext.services.logger,
    dataLayer: defaultContext.dataLayer,
  })()

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    dataSources: () => sources,
    context: () => ({
      ...defaultContext,
      ...context,
    }),
  })

  return { server, ...sources }
}
