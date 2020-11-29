import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { pipe } from 'fp-ts/lib/pipeable'
import { flow, identity } from 'fp-ts/lib/function'
import {
  ObjectID,
  FilterQuery,
  UpdateQuery,
  ObjectId,
  CollectionInsertOneOptions,
  CollectionInsertManyOptions,
  UpdateOneOptions,
  UpdateManyOptions,
  FindOneOptions,
  CommonOptions,
  MongoError,
  Db,
} from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as E from 'fp-ts/lib/Either'
import {
  GraphQLContext,
  DataLayer,
  DistributiveOmit,
  DataSources,
} from 'types/app'
import { ILogger } from 'services/LogService'

type Update<T> = UpdateQuery<T> | Partial<T>
type WithNonNullable = { nonNullable?: boolean; onNullError?: Error }

export const toObjectId = (id: ObjectID | string) => {
  if (id instanceof ObjectID) return id
  return new ObjectId(id)
}

const getDataLayer: (
  dataLayer?: DataLayer,
) => RTE.ReaderTaskEither<unknown, Error, DataLayer> = flow(
  E.fromNullable(new Error('Failed to initialize `dataLayer`.')),
  RTE.fromEither,
)

export interface MongoDataSourceOptions {
  collection: string
  dataLayer: DataLayer
  logger: ILogger
}

export class MongoDataSource<T extends { _id: ObjectID }> extends DataSource<
  GraphQLContext
> {
  protected collection: string
  protected dataLayer: DataLayer
  protected logger: ILogger
  protected context?: GraphQLContext
  public constructor({
    collection,
    dataLayer,
    logger,
  }: MongoDataSourceOptions) {
    super()
    this.collection = collection
    this.dataLayer = dataLayer
    this.logger = logger

    this.error = this.error.bind(this)
    this.nonNullable = this.nonNullable.bind(this)

    this.findOne = this.findOne.bind(this)
    this.updateOne = this.updateOne.bind(this)
    this.deleteOne = this.deleteOne.bind(this)
  }

  public initialize({ context }: DataSourceConfig<GraphQLContext>) {
    this.context = context
  }

  protected error<A extends Error>(err: A): A {
    this.logger.error(err.message)()

    return err
  }

  protected nonNullable(query: FilterQuery<T>, onNullError?: Error) {
    return RTE.chainW((document: T | null) =>
      RTE.fromEither(
        E.fromNullable(
          onNullError ??
            new MongoError(
              `Failed to find a document matching ${JSON.stringify(
                query,
              )} in "${this.collection}" for a non-nullable operation.`,
            ),
        )(document),
      ),
    )
  }

  public insertOne = (
    document: DistributiveOmit<T, '_id'>,
    options?: CollectionInsertOneOptions,
  ) => {
    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.insertOne<DistributiveOmit<T, '_id'>>(
          this.collection,
          document,
          options,
        ),
      ),
      RTE.mapLeft(this.error),
    )
  }

  public insertMany = (
    documents: DistributiveOmit<T, '_id'>[],
    options?: CollectionInsertManyOptions,
  ) => {
    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.insertMany<DistributiveOmit<T, '_id'>>(
          this.collection,
          documents,
          options,
        ),
      ),
      RTE.mapLeft(this.error),
    )
  }

  public findOne<O extends WithNonNullable>(
    query: FilterQuery<T>,
    options?: FindOneOptions & O,
  ): RTE.ReaderTaskEither<
    Db,
    Error | MongoError,
    O['nonNullable'] extends true ? NonNullable<T> : T | null
  >
  public findOne<O extends WithNonNullable>(
    query: FilterQuery<T>,
    options?: FindOneOptions & O,
  ): RTE.ReaderTaskEither<Db, Error | MongoError, T | null> {
    const { nonNullable, onNullError, ...o } = options ?? {}

    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.findOne<T>(this.collection, query, o),
      ),
      nonNullable ? this.nonNullable(query, onNullError) : identity,
      RTE.mapLeft(this.error),
    )
  }

  public findMany = (query: FilterQuery<T>, options?: FindOneOptions) => {
    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.findMany<T>(this.collection, query, options),
      ),
      RTE.mapLeft(this.error),
    )
  }

  public updateOne<O extends WithNonNullable>(
    query: FilterQuery<T>,
    update: Update<T>,
    options?: UpdateOneOptions & O,
  ): RTE.ReaderTaskEither<
    Db,
    Error | MongoError,
    O['nonNullable'] extends true ? NonNullable<T> : T | null
  >
  public updateOne<O extends WithNonNullable>(
    query: FilterQuery<T>,
    update: Update<T>,
    options?: UpdateOneOptions & O,
  ): RTE.ReaderTaskEither<Db, Error | MongoError, T | null> {
    const { nonNullable, onNullError, ...o } = options ?? {}

    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.updateOne<T>(this.collection, query, update, o),
      ),
      nonNullable ? this.nonNullable(query, onNullError) : identity,
      RTE.mapLeft(this.error),
    )
  }

  public updateMany = (
    query: FilterQuery<T>,
    update: Update<T>,
    options?: UpdateManyOptions,
  ) => {
    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.updateMany<T>(this.collection, query, update, options),
      ),
      RTE.mapLeft(this.error),
    )
  }

  public deleteOne<O extends WithNonNullable>(
    query: FilterQuery<T>,
    options?: CommonOptions & O,
  ): RTE.ReaderTaskEither<
    Db,
    Error | MongoError,
    O['nonNullable'] extends true ? NonNullable<T> : T | null
  >
  public deleteOne<O extends WithNonNullable>(
    query: FilterQuery<T>,
    options?: CommonOptions & O,
  ): RTE.ReaderTaskEither<Db, Error | MongoError, T | null> {
    const { nonNullable, onNullError, ...o } = options ?? {}

    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.deleteOne<T>(this.collection, query, o),
      ),
      nonNullable ? this.nonNullable(query, onNullError) : identity,
      RTE.mapLeft(this.error),
    )
  }

  public deleteMany = (query: FilterQuery<T>, options?: CommonOptions) => {
    return pipe(
      getDataLayer(this.dataLayer),
      RTE.chainW((dataLayer) =>
        dataLayer.deleteMany<T>(this.collection, query, options),
      ),
      RTE.mapLeft(this.error),
    )
  }
}
