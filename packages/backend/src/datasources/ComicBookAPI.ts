import { ComicBookDbObject, ComicSeriesDbObject } from 'types/server-schema'
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

  public getByUrls = (urls: string[]) => {
    const { findMany } = this.dataLayer!
    return pipe(
      findMany<ComicBookDbObject>(this.collection, { url: { $in: urls } }),
      this.logError,
    )
  }

  public getBySeriesAndRelease = (
    series: ComicSeriesDbObject['_id'][],
    month: number,
    year: number,
  ) => {
    const { findMany } = this.dataLayer!
    return pipe(
      findMany<ComicBookDbObject>(this.collection, {
        $and: [
          { comicSeries: { $in: series } },
          {
            releaseDate: {
              $gte: new Date(`${year}-${month}-01`),
              $lt: new Date(
                month + 1 > 12
                  ? `${year + 1}-01-01`
                  : `${year}-${month + 1}-01`,
              ),
            },
          },
        ],
      }),
      this.logError,
    )
  }
}
