import { DataSource } from 'apollo-datasource'
import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'fp-ts/lib/Option';
import { mapLeft } from 'fp-ts/lib/ReaderTaskEither';
import { findOne, findMany, insertOne } from 'mongad'
import { ComicBook } from 'types/schema'
import { GraphQLContext } from 'types/app'
import { logError, partialRun } from '../lib';

export class ComicBookSource extends DataSource<GraphQLContext> {
  private collection: string;
  private context: GraphQLContext;
  public constructor() {
    super()
    this.collection = 'comicBook'
  }

  public initialize({ context } = {}) {
    this.context = context
  }

  public getOne(id: string) {
    const { logger, db } = this.context
    return map(
      pipe(
        findOne<ComicBook>(this.collection, { _id: id }),
        mapLeft(logError(logger)),
        partialRun,
      )
    )(db)
  }

  public getMany(ids: string[]) {
    const { logger, db } = this.context
    return map(
      pipe(
        findMany<ComicBook>(this.collection, { _id: { $in: ids } }),
        mapLeft(logError(logger)),
        partialRun,
      )
    )(db)
  }
}