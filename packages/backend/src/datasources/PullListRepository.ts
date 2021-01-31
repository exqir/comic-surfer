import { Db, MongoError, ObjectID } from 'mongodb'

import { PullListDbObject } from 'types/server-schema'
import {
  MongoDataSource,
  MongoDataSourceOptions,
  toObjectId,
} from './MongoDataSource'
import { IPullListRepository } from '../models/PullList/PullListModel'

export const pullListCollection = 'pullList'
export class PullListRepository extends MongoDataSource<PullListDbObject>
  implements IPullListRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: MongoDataSourceOptions['dataLayer']
    logger: MongoDataSourceOptions['logger']
  }) {
    super({ collection: pullListCollection, dataLayer, logger })
  }

  public createPullList = (owner: string) => this.insertOne({ owner, list: [] })

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
