import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import { Db, ObjectID } from 'mongodb'
import { Response, Request } from 'express'
import { Option } from 'fp-ts/lib/Option'
import {
  ComicBookRepository,
  ComicSeriesRepository,
  PublisherRepository,
  PullListRepository,
  QueueRepository,
} from '../datasources'
import { IScraper } from 'services/ScrapeService'
import { ILogger } from 'services/LogService'
import mongad from 'mongad'

export interface Logger {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export type DataLayer = typeof mongad

export interface DataSources {
  comicBook: ComicBookRepository
  comicSeries: ComicSeriesRepository
  publisher: PublisherRepository
  pullList: PullListRepository
  queue: QueueRepository
}

export interface Services {
  scrape: IScraper
  logger: ILogger
}

/**
 * Context provided to all requests handled by the GraphQL server.
 */
export interface GraphQLContext {
  req: Request
  res: Response
  dataLayer: DataLayer
  dataSources: DataSources
  services: Services
  db: Option<Db>
  user: Option<string>
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

export type NonNullableResolver<
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
) => Result | Promise<Result>

// https://stackoverflow.com/questions/57103834/typescript-omit-a-property-from-all-interfaces-in-a-union-but-keep-the-union-s
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never

// Use this instead of mongodb's WithId because its use of Omit
// removes type information from union types for which we use
// DistributiveOmit in order to preserve them.
export type WithId<T> = T & { _id: ObjectID }
