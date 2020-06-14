import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, FilterQuery, ObjectID, WithId } from 'mongodb'
import { Option } from 'fp-ts/lib/Option'
import { ComicBookAPI, ComicSeriesAPI } from '../datasources'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { PublisherAPI } from 'datasources/PublisherAPI'
import { PullListAPI } from 'datasources/PullListAPI'
import { ScrapeService } from 'services/ScrapeService'

export interface Logger {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export interface DataLayer {
  findOne: <T extends object>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T | null>
  findMany: <T extends object>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T[]>
  insertOne: <T extends object>(
    collection: string,
    document: T,
  ) => ReaderTaskEither<Db, MongoError, WithId<T>>
  insertMany: <T extends object>(
    collection: string,
    documents: T[],
  ) => ReaderTaskEither<Db, MongoError, WithId<T>[]>
  updateOne: <T extends object>(
    collection: string,
    query: FilterQuery<T>,
    update: {},
  ) => ReaderTaskEither<Db, MongoError, T | null>
  updateMany: <T extends object>(
    collection: string,
    query: FilterQuery<T>,
    update: {},
  ) => ReaderTaskEither<Db, MongoError, T[]>
  deleteOne: <T extends object>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T | null>
  deleteMany: <T extends object>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T[]>
}

export interface DataSources {
  comicBook: ComicBookAPI
  comicSeries: ComicSeriesAPI
  publisher: PublisherAPI
  pullList: PullListAPI
}

export interface Services {
  scrape: ScrapeService
  logger: Logger
}

/**
 * Context provided to all requests handled by the GraphQL server.
 */
export interface GraphQLContext {
  // req:
  dataLayer: DataLayer
  dataSources: DataSources
  services: Services
  db: Option<Db>
  user: string
}

/**
 *
 */
export type GraphQLResolver<Source, Argument> = GraphQLFieldResolver<
  Source,
  GraphQLContext,
  Argument
>

export type Resolver<
  Result,
  Arguments,
  Parent = {},
  Context = GraphQLContext,
  Info = GraphQLResolveInfo
> = (
  parent: Parent,
  args: Arguments,
  context: Context,
  info: Info,
) => Result | Promise<Result | null> | null

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
