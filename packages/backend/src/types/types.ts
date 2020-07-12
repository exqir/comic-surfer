import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import { Db } from 'mongodb'
import { Response, Request } from 'express'
import { Option } from 'fp-ts/lib/Option'
import { ComicBookAPI, ComicSeriesAPI } from '../datasources'
import { PublisherAPI } from 'datasources/PublisherAPI'
import { PullListAPI } from 'datasources/PullListAPI'
import { IScraper } from 'services/ScrapeService'
import mongad from 'mongad'

export interface Logger {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export type DataLayer = typeof mongad

export interface DataSources {
  comicBook: ComicBookAPI
  comicSeries: ComicSeriesAPI
  publisher: PublisherAPI
  pullList: PullListAPI
}

export interface Services {
  scrape: IScraper
  logger: Logger
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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
