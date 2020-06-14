import { ComicBookDbObject } from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const comicBookCollection = 'comicBook'
export class ComicBookAPI extends MongoDataSource<ComicBookDbObject> {
  public constructor() {
    super(comicBookCollection)
  }

  public insertMany = (documents: Omit<ComicBookDbObject, '_id'>[]) => {
    const { insertMany } = this.dataLayer!
    return pipe(
      insertMany<Omit<ComicBookDbObject, '_id'>>(this.collection, documents),
      this.logError,
    )
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

  public enhanceWithScrapResult = (
    url: string,
    update: {
      coverImgUrl: string
      releaseDate: Date | null
      creators: { name: string }[]
    },
  ) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicBookDbObject>(
        this.collection,
        { url },
        { $set: { ...update } },
      ),
      this.logError,
    )
  }
}
