import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { MongoError, Db } from 'mongodb'
import { some, map, Option } from 'fp-ts/lib/Option'
import { right, left, Either, fold } from 'fp-ts/lib/Either'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { KeyValueCache } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server'
import { DataSources, Services, DataLayer } from 'types/app'
import typeDefs, { resolvers } from '../schema'
import {
  ComicBookAPI,
  ComicSeriesAPI,
  PublisherAPI,
  PullListAPI,
} from '../datasources'
import { IScraper } from 'services/ScrapeService'

/**
 * Creates a `ReaderTaskEither<Db, MongoError, T>` that returns `value` as right
 * side or a `MongoError` as left side in case of `isFailure`.
 * @param value {T} Value to be returned when the Task is executed.
 * @param isFailure {boolean} Defines if a success or failure should be mocked.
 * @returns reader {ReaderTaskEither<Db, MongoError, T>}
 */
export function createMockReaderWithReturnValue<T>(
  value: T,
  isFailure?: boolean,
): (db: Db) => () => Promise<Either<MongoError, T>>
export function createMockReaderWithReturnValue<T>(
  value: T[],
  isFailure?: boolean,
): (db: Db) => () => Promise<Either<MongoError, T[]>>
export function createMockReaderWithReturnValue<T>(
  value: T | T[],
  isFailure?: boolean,
) {
  return (db: Db) => () =>
    new Promise<Either<MongoError, T | T[]>>((resolve, reject) => {
      const either = isFailure
        ? left(new MongoError('TestError'))
        : right(value)
      resolve(either)
    })
}

/**
 * Creates a `TaskEither<Error, T>` that returns `value` as right
 * side or a `Error` as left side in case of `isFailure`.
 * @param value {T} Value to be returned when the Task is executed.
 * @param isFailure {boolean} Defines if a success or failure should be mocked.
 * @returns reader {TaskEither<Error, T>}
 */
export function createMockTaskWithReturnValue<T>(
  value: T,
  isFailure?: boolean,
): () => Promise<Either<Error, T>>
export function createMockTaskWithReturnValue<T>(
  value: T[],
  isFailure?: boolean,
): () => Promise<Either<Error, T[]>>
export function createMockTaskWithReturnValue<T>(
  value: T | T[],
  isFailure?: boolean,
) {
  return () =>
    new Promise<Either<Error, T | T[]>>((resolve, reject) => {
      const either = isFailure ? left(new Error('TestError')) : right(value)
      resolve(either)
    })
}

/**
 * Run ReaderTaskEither with an empty Db mock.
 * @param rte {RTE.ReaderTaskEither} - ReaderTaskEither to be run.
 */
export const runRTEwithMockDb = <L, R>(rte: RTE.ReaderTaskEither<Db, L, R>) =>
  RTE.run(rte, {} as Db)

const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
}
const mockDataLayer = {
  findOne: jest.fn(),
  findMany: jest.fn(),
  insertOne: jest.fn(),
  insertMany: jest.fn(),
  updateOne: jest.fn(),
  updateMany: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
}

const mockScraper: IScraper = {
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
    // req: {} as NextApiRequest,
    dataLayer: (mockDataLayer as unknown) as DataLayer,
    dataSources: {} as DataSources,
    services: {
      scrape: mockScraper,
      logger: mockLogger,
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
  delete defaultContext.dataSources
  const comicBook = new ComicBookAPI()
  const comicSeries = new ComicSeriesAPI()
  const publisher = new PublisherAPI()
  const pullList = new PullListAPI()

  const server = new ApolloServer({
    typeDefs: [DIRECTIVES, ...typeDefs],
    resolvers,
    dataSources: () => ({
      comicBook,
      comicSeries,
      publisher,
      pullList,
    }),
    context: () => ({
      ...defaultContext,
      ...context,
    }),
  })

  return { server, comicBook, comicSeries, publisher, pullList }
}
