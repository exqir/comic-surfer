import { ComicSeriesDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import { mapLeft } from 'fp-ts/lib/ReaderTaskEither'
import { logError } from 'lib'

export const comicSeriesCollection = 'comicSeries'
export class ComicSeriesAPI extends MongoDataSource<ComicSeriesDbObject> {
  public constructor() {
    super(comicSeriesCollection)
  }

  // TODO: check if comic book is already in comic series
  // e.g. list: { $ne: comicSeriesId }
  public addComicBook(id: ObjectID, comicBookId: ObjectID) {
    const { updateOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      updateOne<ComicSeriesDbObject>(
        this.collection,
        { _id: id },
        { $push: { issues: comicBookId } },
      ),
      mapLeft(logError(logger)),
    )
  }
}
