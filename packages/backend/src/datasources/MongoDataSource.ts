import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { pipe } from 'fp-ts/lib/pipeable'
import { ObjectID, FilterQuery, ObjectId } from 'mongodb'
import { mapLeft } from 'fp-ts/lib/ReaderTaskEither'
import { GraphQLContext, DataLayer, Omit } from 'types/app'
import { logError } from 'lib'

export const toObjectId = (id: ObjectID | string) => {
  if (id instanceof ObjectID) return id
  return new ObjectId(id)
}

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

  public initialize({ context }: DataSourceConfig<GraphQLContext>) {
    this.context = context
    this.dataLayer = context.dataLayer
  }

  protected get logError() {
    const { logger } = this.context?.services!
    return mapLeft(logError(logger))
  }

  public insert = (document: Omit<T, '_id'>) => {
    const { insertOne } = this.dataLayer!
    return pipe(
      insertOne<Omit<T, '_id'>>(this.collection, document),
      this.logError,
    )
  }

  public getById = (id: ObjectID) => {
    const { findOne } = this.dataLayer!
    return pipe(
      findOne<T>(this.collection, { _id: toObjectId(id) } as T),
      this.logError,
    )
  }

  public getByIds = (ids: ObjectID[]) => {
    const { findMany } = this.dataLayer!
    return pipe(
      findMany<T>(this.collection, {
        _id: { $in: ids.map(toObjectId) },
      } as FilterQuery<T>),
      this.logError,
    )
  }
}
