import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { pipe } from 'fp-ts/lib/pipeable'
import { map } from 'fp-ts/lib/Option'
import { ObjectID, Db, MongoError, FilterQuery } from 'mongodb'
import { mapLeft, ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { GraphQLContext, DataLayer, Omit } from 'types/app'
import { logError, partialRun } from '../lib'

export class MongoDataSource<T extends { _id: ObjectID }> extends DataSource<
  GraphQLContext
> {
  protected collection: string
  protected context?: GraphQLContext
  protected dataLayer?: DataLayer
  public constructor(collection: string) {
    super()
    this.collection = collection
  }

  protected execute<D>(rte: ReaderTaskEither<Db, MongoError, D>) {
    const { logger, db } = this.context!
    return map(pipe(rte, mapLeft(logError(logger)), partialRun))(db)
  }

  public initialize({ context }: DataSourceConfig<GraphQLContext>) {
    this.context = context
    this.dataLayer = context.dataLayer
  }

  public insert(document: Omit<T, '_id'>) {
    const { insertOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      insertOne<Omit<T, '_id'>>(this.collection, document),
      mapLeft(logError(logger)),
    )
  }

  public getById(id: ObjectID) {
    const { findOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      findOne<T>(this.collection, { _id: id } as T),
      mapLeft(logError(logger)),
    )
  }

  public getByIds(ids: ObjectID[]) {
    const { findMany } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      findMany<T>(this.collection, { _id: { $in: ids } } as FilterQuery<T>),
      mapLeft(logError(logger)),
    )
  }
}
