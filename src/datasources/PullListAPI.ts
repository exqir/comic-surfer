import { PullListDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import { mapLeft } from 'fp-ts/lib/ReaderTaskEither'
import { logError } from 'lib'

export const pullListCollection = 'pullList'
export class PullListAPI extends MongoDataSource<PullListDbObject> {
  public constructor() {
    super(pullListCollection)
  }

  public getByUser(user: string) {
    const { findOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      findOne<PullListDbObject>(this.collection, { owner: user }),
      mapLeft(logError(logger)),
    )
  }

  public addComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      updateOne<PullListDbObject>(
        this.collection,
        { _id: id },
        // TODO: check if series is already in pull list
        // e.g. list: { $ne: comicSeriesId }
        { $push: { list: comicSeriesId } },
      ),
      mapLeft(logError(logger)),
    )
  }

  public removeComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      updateOne<PullListDbObject>(
        this.collection,
        { _id: id },
        { $pull: { list: comicSeriesId } },
      ),
      mapLeft(logError(logger)),
    )
  }
}
