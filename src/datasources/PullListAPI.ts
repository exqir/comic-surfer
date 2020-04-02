import { PullListDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const pullListCollection = 'pullList'
export class PullListAPI extends MongoDataSource<PullListDbObject> {
  public constructor() {
    super(pullListCollection)
  }

  public getByUser(user: string) {
    const { findOne } = this.dataLayer!
    return pipe(
      findOne<PullListDbObject>(this.collection, { owner: user }),
      this.logError,
    )
  }

  public addComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<PullListDbObject>(
        this.collection,
        { _id: id },
        // TODO: check if series is already in pull list
        // e.g. list: { $ne: comicSeriesId }
        { $push: { list: comicSeriesId } },
      ),
      this.logError,
    )
  }

  public removeComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<PullListDbObject>(
        this.collection,
        { _id: id },
        { $pull: { list: comicSeriesId } },
      ),
      this.logError,
    )
  }
}
