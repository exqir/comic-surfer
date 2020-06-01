import { ComicBookDbObject } from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const comicBookCollection = 'comicBook'
export class ComicBookAPI extends MongoDataSource<ComicBookDbObject> {
  public constructor() {
    super(comicBookCollection)
  }

  public updateReleaseDate = (id: ObjectID, newDate: Date) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicBookDbObject>(
        this.collection,
        { _id: toObjectId(id) },
        { $set: { releaseDate: newDate } },
      ),
      this.logError,
    )
  }
}
