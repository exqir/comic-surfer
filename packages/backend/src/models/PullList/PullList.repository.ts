import { Db, MongoError, ObjectID } from 'mongodb'

import { PullListDbObject } from 'types/graphql-schema'
import {
  MongoDataSource,
  IMongoDataSourceOptions,
  toObjectId,
} from 'datasources/MongoDataSource'
import { IPullListRepository } from './PullList.interface'

export const pullListCollection = 'pullList'
export class PullListRepository extends MongoDataSource<PullListDbObject>
  implements IPullListRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: IMongoDataSourceOptions['dataLayer']
    logger: IMongoDataSourceOptions['logger']
  }) {
    super({ collection: pullListCollection, dataLayer, logger })
  }

  public createPullList = (owner: string) => this.insertOne({ owner, list: [] })

  public getOrCreatePullList = (owner: string) =>
    this.updateOne(
      { owner },
      { $setOnInsert: { owner, list: [] } },
      { upsert: true, nonNullable: true },
    )

  public getPullListByOwner = (owner: string) =>
    this.findOne({ owner }, { nonNullable: true })

  public getPullListByOwnerOrNull = (owner: string) => this.findOne({ owner })

  public addComicSeriesToPullList = (owner: string, comicSeriesId: ObjectID) =>
    this.updateOne(
      { owner },
      { $addToSet: { list: toObjectId(comicSeriesId) } },
      { nonNullable: true },
    )

  public removeComicSeriesFromPullList = (
    owner: string,
    comicSeriesId: ObjectID,
  ) =>
    this.updateOne(
      { owner },
      { $pull: { list: toObjectId(comicSeriesId) } },
      { nonNullable: true },
    )
}
