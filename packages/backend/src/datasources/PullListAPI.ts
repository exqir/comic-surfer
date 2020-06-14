import { PullListDbObject } from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const pullListCollection = 'pullList'
export class PullListAPI extends MongoDataSource<PullListDbObject> {
  public constructor() {
    super(pullListCollection)
  }

  public getByUser = (user: string) => {
    const { findOne } = this.dataLayer!
    return pipe(
      findOne<PullListDbObject>(this.collection, { owner: user }),
      this.logError,
    )
  }

  public addComicSeries = (user: string, comicSeriesId: ObjectID) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<PullListDbObject>(
        this.collection,
        { owner: user },
        { $addToSet: { list: toObjectId(comicSeriesId) } },
      ),
      this.logError,
    )
  }

  public removeComicSeries = (user: string, comicSeriesId: ObjectID) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<PullListDbObject>(
        this.collection,
        { owner: user },
        { $pull: { list: toObjectId(comicSeriesId) } },
      ),
      this.logError,
    )
  }
}
