import { GraphQLFieldResolver } from 'graphql'
import { NextApiRequest } from 'next'
import { Db } from 'mongodb';
import { Option } from 'fp-ts/lib/Option'
import { ComicBookSource } from '../datasources/ComicBookSource'

export interface Logger {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

interface DataSources {
  comicBook: ComicBookSource;
}

/**
 * Context provided to all requests handled by the GraphQL server.
 */
export interface GraphQLContext {
  req: NextApiRequest;
  dataSources: DataSources;
  logger: Logger;
  db: Option<Db>;
}

/**
 *
 */
export type GraphQLResolver<Source, Argument> = GraphQLFieldResolver<
  Source,
  GraphQLContext,
  Argument
>