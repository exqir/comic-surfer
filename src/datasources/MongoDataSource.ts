import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { pipe } from 'fp-ts/lib/pipeable'
import { map } from 'fp-ts/lib/Option'
import { ObjectID, Db, MongoError } from 'mongodb'
import { mapLeft, ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { GraphQLContext, DataLayer, Omit } from 'types/app'
import { logError, partialRun } from '../lib'

interface WithId {
  _id: ObjectID
}

export class MongoDataSource<T extends WithId> extends DataSource<
  GraphQLContext
> {
  public collection: string
  private context?: GraphQLContext
  public dataLayer?: DataLayer
  public constructor(collection: string) {
    super()
    this.collection = collection
  }

  public execute<D>(rte: ReaderTaskEither<Db, MongoError, D>) {
    const { logger, db } = this.context!
    return map(pipe(rte, mapLeft(logError(logger)), partialRun))(db)
  }

  public initialize({ context }: DataSourceConfig<GraphQLContext>) {
    this.context = context
    this.dataLayer = context.dataLayer
  }

  public insert(document: Omit<T, '_id'>) {
    const { insertOne } = this.dataLayer!
    return this.execute(insertOne(this.collection, document))
  }

  public getById(id: ObjectID) {
    const { findOne } = this.dataLayer!
    return this.execute(
      // TODO: Extending the Generic T  doesn't seem to force the type for
      // FilterQuery to recognize the property _id to be on type T.
      // @ts-ignore
      findOne<T>(this.collection, { _id: id }),
    )
  }

  public getByIds(ids: ObjectID[]) {
    const { findMany } = this.dataLayer!
    return this.execute(
      // @ts-ignore
      findMany<T>(this.collection, { _id: { $in: ids } }),
    )
  }
}
