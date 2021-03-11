import type { GraphQLResolveInfo } from 'graphql'
import type { Db, MongoError, ObjectID } from 'mongodb'
import type { Response, Request } from 'express'
import type { Option } from 'fp-ts/lib/Option'
import type mongad from 'mongad'

import type { IScraperService } from 'services/Scraper/Scraper.interface'
import type { ILogger } from 'services/LogService'
import type { IAuthentication } from 'services/Authentication'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import type { IQueueRepository } from 'models/Queue/Queue.interface'

export interface Logger {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export type DataLayer = typeof mongad

export interface IDataSources {
  comicBook: IComicBookRepository<Db, Error | MongoError>
  comicSeries: IComicSeriesRepository<Db, Error | MongoError>
  publisher: IPublisherRepository<Db, Error | MongoError>
  pullList: IPullListRepository<Db, Error | MongoError>
  queue: IQueueRepository<Db, Error | MongoError>
  [index: string]: any
}

export interface Services {
  scrape: IScraperService
  logger: ILogger
  authentication: IAuthentication
}

/**
 * Context provided to all requests handled by the GraphQL server.
 */
export interface GraphQLContext {
  req: Request
  res: Response
  dataLayer: DataLayer
  dataSources: IDataSources
  services: Services
  db: Option<Db>
  user: Option<string>
}

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
