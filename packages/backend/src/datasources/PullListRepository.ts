import { PullListDbObject } from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'

export const pullListCollection = 'pullList'
export class PullListRepository extends MongoDataSource<PullListDbObject> {
  public constructor() {
    super(pullListCollection)
  }

  public getPullListByUser = (user: string) =>
    this.findOne({ owner: user }, { nonNullable: true })

  public addComicSeriesToPullList = (user: string, comicSeriesId: ObjectID) =>
    this.updateOne(
      { owner: user },
      { $addToSet: { list: toObjectId(comicSeriesId) } },
      { nonNullable: true },
    )

  public removeComicSeriesFromPullList = (
    user: string,
    comicSeriesId: ObjectID,
  ) =>
    this.updateOne(
      { owner: user },
      { $pull: { list: toObjectId(comicSeriesId) } },
      { nonNullable: true },
    )
}
