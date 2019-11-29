import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { pipe } from 'fp-ts/lib/pipeable'
import { map } from 'fp-ts/lib/Option'
import { ObjectID } from 'mongodb'
import { mapLeft } from 'fp-ts/lib/ReaderTaskEither'
import { GraphQLContext, DataLayer } from 'types/app'
import { logError, partialRun } from '../lib'

interface WithId {
  _id: ObjectID
}

export class MongoDataSource<T extends WithId> extends DataSource<
  GraphQLContext
> {
  private collection: string
  private context?: GraphQLContext
  private dataLayer?: DataLayer
  public constructor(collection: string) {
    super()
    this.collection = collection
  }

  public initialize({ context }: DataSourceConfig<GraphQLContext>) {
    this.context = context
    this.dataLayer = context.dataLayer
  }

  public getById(id: string) {
    const { findOne } = this.dataLayer!
    const { logger, db } = this.context!
    return map(
      pipe(
        // TODO: Extending the Generic T  doesn't seem to force the type for
        // FilterQuery to recognize the property _id to be on type T.
        // @ts-ignore
        findOne<T>(this.collection, { _id: id }),
        mapLeft(logError(logger)),
        partialRun,
      ),
    )(db)
  }

  public getByIds(ids: string[]) {
    const { findMany } = this.dataLayer!
    const { logger, db } = this.context!
    return map(
      pipe(
        // @ts-ignore
        findMany<T>(this.collection, { _id: { $in: ids } }),
        mapLeft(logError(logger)),
        partialRun,
      ),
    )(db)
  }
}
