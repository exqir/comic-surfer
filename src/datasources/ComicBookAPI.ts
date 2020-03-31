import { ComicBookDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import { mapLeft } from 'fp-ts/lib/ReaderTaskEither'
import { logError } from 'lib'

export const comicBookCollection = 'comicBook'
export class ComicBookAPI extends MongoDataSource<ComicBookDbObject> {
  public constructor() {
    super(comicBookCollection)
  }

  public updateReleaseDate(id: ObjectID, newDate: number) {
    const { updateOne } = this.dataLayer!
    const { logger } = this.context!
    return pipe(
      updateOne<ComicBookDbObject>(
        this.collection,
        { _id: id },
        { $set: { releaseDate: newDate } },
      ),
      mapLeft(logError(logger)),
    )
  }
}
