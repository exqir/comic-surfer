import { PullListDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'

export const pullListCollection = 'pullList'
export class PullListAPI extends MongoDataSource<PullListDbObject> {
  public constructor() {
    super(pullListCollection)
  }

  public getByUser(user: String) {
    const { findOne } = this.dataLayer!
    return this.execute(findOne(this.collection, { owner: user }))
  }

  public addComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return this.execute(
      updateOne(
        this.collection,
        { _id: id },
        { $push: { list: comicSeriesId } },
      ),
    )
  }

  public removeComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return this.execute(
      updateOne(
        this.collection,
        { _id: id },
        { $pull: { list: comicSeriesId } },
      ),
    )
  }
}
