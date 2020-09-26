import {
  ComicBookDbObject,
  ComicSeriesDbObject,
  ComicBookType,
} from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const comicBookCollection = 'comicBook'
export class ComicBookAPI extends MongoDataSource<ComicBookDbObject> {
  public constructor() {
    super(comicBookCollection)
  }

  public insertMany = (
    documents: Omit<ComicBookDbObject, '_id' | 'lastModified'>[],
  ) => {
    const { insertMany } = this.dataLayer!
    return pipe(
      insertMany<Omit<ComicBookDbObject, '_id'>>(
        this.collection,
        documents.map((doc) => ({ ...doc, lastModified: new Date() })),
      ),
      this.logError,
    )
  }

  public updateReleaseDate = (id: ObjectID, newDate: Date) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicBookDbObject>(
        this.collection,
        { _id: toObjectId(id) },
        {
          $set: { releaseDate: newDate },
          $currentDate: { lastModified: true },
        },
      ),
      this.logError,
    )
  }

  public enhanceWithScrapResult = (
    url: string,
    {
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
    }: {
      publisher: ObjectID | null
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
        {
          $set: { publisher, coverImgUrl, releaseDate, creators },
          $currentDate: { lastModified: true },
        },
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
    type: ComicBookType,
  ) => {
    const { findMany } = this.dataLayer!
    return pipe(
      findMany<ComicBookDbObject>(this.collection, {
        $and: [
          { comicSeries: { $in: series } },
          {
            releaseDate: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1),
            },
          },
          { type },
        ],
      }),
      this.logError,
    )
  }

  public getByRelease = (month: number, year: number, type: ComicBookType) => {
    const { findMany } = this.dataLayer!
    return pipe(
      findMany<ComicBookDbObject>(this.collection, {
        $and: [
          {
            releaseDate: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1),
            },
          },
          { type },
        ],
      }),
      this.logError,
    )
  }

  public getUpcoming = () => {
    const { findMany } = this.dataLayer!
    const date = new Date()
    return pipe(
      findMany<ComicBookDbObject>(this.collection, {
        $and: [
          {
            // releaseDate between now and a month from now
            releaseDate: {
              $gte: new Date(),
              $lt: new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
              ),
            },
          },
          {
            // lastModified more then two weeks ago
            lastModified: {
              $lte: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - 14,
              ),
            },
          },
        ],
      }),
      this.logError,
    )
  }
}
