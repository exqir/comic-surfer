import { Db, MongoError } from 'mongodb'

import type { ComicBookDbObject, ComicBookType } from 'types/server-schema'
import type {
  IComicBookRepository,
  ComicBookId,
  ComicSeriesId,
  Month,
  IComicBookDetails,
} from './ComicBook.interface'
import {
  MongoDataSource,
  MongoDataSourceOptions,
  toObjectId,
} from '../../datasources/MongoDataSource'

export const comicBookCollection = 'comicBook'
export class ComicBookRepository extends MongoDataSource<ComicBookDbObject>
  implements IComicBookRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: MongoDataSourceOptions['dataLayer']
    logger: MongoDataSourceOptions['logger']
  }) {
    super({ collection: comicBookCollection, dataLayer, logger })
  }

  public addComicBooks = (
    comicBooks: Omit<ComicBookDbObject, '_id' | 'lastModified'>[],
  ) =>
    this.insertMany(
      comicBooks.map((comicBook) => ({
        ...comicBook,
        lastModified: new Date(),
      })),
    )

  public updateReleaseDate = (id: ComicBookId, newDate: Date) =>
    this.updateOne(
      { _id: toObjectId(id) },
      {
        $set: { releaseDate: newDate },
        $currentDate: { lastModified: true },
      },
      { nonNullable: true },
    )

  public updateComicBookDetails = (
    url: string,
    {
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    }: IComicBookDetails,
  ) =>
    this.updateOne(
      { url },
      {
        $set: { publisher, coverImgUrl, releaseDate, creators, description },
        $currentDate: { lastModified: true },
      },
      { nonNullable: true },
    )

  public getById = (id: ComicBookId) =>
    this.findOne({ _id: id }, { nonNullable: true })

  public getByIds = (ids: ComicBookId[]) => this.findMany({ _id: { $in: ids } })

  public getByUrls = (urls: string[]) => this.findMany({ url: { $in: urls } })

  public getBySeriesAndReleaseInMonth = (
    series: ComicSeriesId[],
    month: Month,
    year: number,
    type: ComicBookType,
  ) =>
    this.findMany({
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
    })

  public getByReleaseInMonth = (
    month: Month,
    year: number,
    type: ComicBookType,
  ) =>
    this.findMany({
      $and: [
        {
          releaseDate: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
        { type },
      ],
    })

  public getUpcomingReleasesNotUpated = (date: Date) =>
    this.findMany({
      $and: [
        {
          // releaseDate between date and a month from it
          releaseDate: {
            $gte: date,
            $lt: new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate(),
            ),
          },
        },
        {
          // lastModified more then two weeks before date
          lastModified: {
            $lte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 14,
            ),
          },
        },
      ],
    })
}
