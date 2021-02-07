import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import { Response, Request } from 'express'
import { Option } from 'fp-ts/lib/Option'
import { IScraper } from 'services/ScrapeService'
import { ILogger } from 'services/LogService'
import mongad from 'mongad'
import { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import { IPullListRepository } from 'models/PullList/PullList.interface'
import { IQueueRepository } from 'models/Queue/Queue.interface'

export interface Logger {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export type DataLayer = typeof mongad

export interface DataSources {
  comicBook: IComicBookRepository<Db, Error | MongoError>
  comicSeries: IComicSeriesRepository<Db, Error | MongoError>
  publisher: IPublisherRepository<Db, Error | MongoError>
  pullList: IPullListRepository<Db, Error | MongoError>
  queue: IQueueRepository<Db, Error | MongoError>
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
