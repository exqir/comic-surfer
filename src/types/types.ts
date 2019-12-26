import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import { NextApiRequest } from 'next'
import { Db, MongoError, FilterQuery } from 'mongodb'
import { Option } from 'fp-ts/lib/Option'
import { ComicBookAPI } from '../datasources/ComicBookAPI'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

export interface Logger {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export interface DataLayer {
  findOne: <T>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T>
  findMany: <T>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T[]>
  insertOne: <T>(
    collection: string,
    document: T,
  ) => ReaderTaskEither<Db, MongoError, T>
  insertMany: <T>(
    collection: string,
    document: T,
  ) => ReaderTaskEither<Db, MongoError, T[]>
  updateOne: <T>(
    collection: string,
    query: FilterQuery<T>,
    update: {},
  ) => ReaderTaskEither<Db, MongoError, T>
  updateMany: <T>(
    collection: string,
    query: FilterQuery<T>,
    update: {},
  ) => ReaderTaskEither<Db, MongoError, T[]>
  deleteOne: <T>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T>
  deleteMany: <T>(
    collection: string,
    query: FilterQuery<T>,
  ) => ReaderTaskEither<Db, MongoError, T[]>
}

export interface DataSources {
  comicBook: ComicBookAPI
}

/**
 * Context provided to all requests handled by the GraphQL server.
 */
export interface GraphQLContext {
  req: NextApiRequest
  dataLayer: DataLayer
  dataSources: DataSources
  logger: Logger
  db: Option<Db>
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
